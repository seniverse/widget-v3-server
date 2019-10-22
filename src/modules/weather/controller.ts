
import { Db } from 'mongodb'
import { WidgetConfig } from '../../utils/types/data'
import { Controller } from '../../utils/types/server'
import TpError from '../../utils/error'
import TpStatsd from '../../utils/statsd'
import { weatherFormatter } from '../shared/weather'
import logger from '../../utils/logger'
import { LANGUAGE_MAP } from '../../utils/constant/language'
import { getDomainRegexp } from '../shared/check'

const statsdRequest = (widgetConfig: WidgetConfig, options: {
  unit: string
  language: string
  location: string
}, excludes: Set<string>, db: Db) => {
  for (const key of Object.keys(options)) {
    if (excludes.has(key)) continue
    TpStatsd.increment(`${key}.${options[key]}.${widgetConfig.id}`)
  }

  TpStatsd.increment(`weather.${widgetConfig.id}.total`)
  TpStatsd.increment(`type.${widgetConfig.baseConfig.flavor}.${widgetConfig.baseConfig.theme}.${widgetConfig.id}`)
  TpStatsd.increment('request.total')

  TpStatsd.unique('request.user', widgetConfig.uid)
  TpStatsd.unique('widget', widgetConfig.id)

  process.nextTick(async () => {
    await db.collection('stat').updateOne(
      {
        uid: widgetConfig.uid,
        token: widgetConfig.token || widgetConfig.id
      },
      {
        $inc: {
          count: 1
        }
      },
      { upsert: true }
    )
  })
}

const getAutoLocation = (ip: string, location: string) => {
  if (/(\d+\.){3}\d+/.test(ip)) return ip.replace(/^::ffff:/, '')
  return location
}

const getAutoLanguage = (language: string): string =>
  LANGUAGE_MAP[language.toLowerCase()] || language

const checkDomainAllowed = (domain: string, allowedDomains: string[]): boolean => {
  if (!allowedDomains || !allowedDomains.length) return true
  for (const allowedDomain of allowedDomains) {
    if (getDomainRegexp(allowedDomain).test(domain)) return true
  }
  return false
}

export const queryWidgetWeather: Controller = async (ctx) => {
  const { token } = ctx.params
  const widgetConfig: WidgetConfig = await ctx.db.collection('widget').findOne({
    $or: [
      {
        token: {
          $exists: true,
          $eq: token
        }
      },
      {
        token: {
          $exists: false
        },
        id: token
      }
    ]
  })

  if (!widgetConfig) {
    throw new TpError.NotFoundError(`can not find widget config for ${token}`)
  }

  // check domain
  const { origin: domain } = ctx.request.header
  const { key, baseConfig, UIConfigs, allowedDomains } = widgetConfig
  logger.debug(`[domain] ${domain}, ${allowedDomains}`)
  if (!checkDomainAllowed(domain, allowedDomains)) {
    throw new TpError.AuthError(`domain ${domain} is not allowed!`)
  }

  const {
    unit,
    geolocation,
    location = baseConfig.location,
    language = baseConfig.language
  } = ctx.request.query

  const autoLocation = `${geolocation}` === 'true' || baseConfig.geolocation
  const detected = ctx.request.query._detected || ctx.request.query.detected

  const lan = getAutoLanguage(language === 'auto' ? detected : language)
  const loc = autoLocation ? getAutoLocation(ctx.request.ip, location) : location

  const qs = {
    key,
    language: lan || 'zh-Hans',
    location: loc || 'beijing',
    unit: unit || baseConfig.unit || 'c',
  }
  logger.info(`[queryWidgetWeather] ${JSON.stringify(widgetConfig)} - ${JSON.stringify(qs)}`)

  const results = await weatherFormatter(UIConfigs, qs)

  statsdRequest(widgetConfig, qs, new Set(['key']), ctx.db)

  ctx.body = {
    success: true,
    results
  }
}
