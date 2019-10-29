
import { Db } from 'mongodb'
import { WidgetConfig } from '../../utils/types/data'
import { Controller } from '../../utils/types/server'
import TpError from '../../utils/error'
import TpStatsd from '../../utils/statsd'
import { weatherFormatter } from '../shared/weather'
import logger from '../../utils/logger'
import { LANGUAGE_MAP } from '../../utils/constant/language'
import { getDomainRegexp } from '../shared/check'

const statsdRequest = (options: {
  widgetConfig: WidgetConfig
  qs: {
    unit: string
    language: string
    location: string
  }
  excludes: Set<string>
  db: Db
  domain: string
}) => {
  const {
    qs,
    db,
    domain,
    excludes,
    widgetConfig
  } = options
  for (const key of Object.keys(qs)) {
    if (excludes.has(key)) continue
    TpStatsd.increment(`${key}.${qs[key]}.${widgetConfig.id}`)
  }

  TpStatsd.increment(`weather.${widgetConfig.id}.total`)
  TpStatsd.increment(`type.${widgetConfig.baseConfig.flavor}.${widgetConfig.baseConfig.theme}.${widgetConfig.id}`)
  TpStatsd.increment('request.total')

  TpStatsd.unique('request.user', widgetConfig.uid)
  TpStatsd.unique('widget', widgetConfig.id)

  process.nextTick(async () => {
    // ensure exists
    await db.collection('stat').updateOne(
      {
        uid: widgetConfig.uid,
        token: widgetConfig.token || widgetConfig.id,
      },
      {
        $setOnInsert: {
          domains: [],
          count: 0
        }
      },
      { upsert: true }
    )

    const res = await db.collection('stat').updateOne(
      {
        uid: widgetConfig.uid,
        token: widgetConfig.token || widgetConfig.id,
        domains: {
          $elemMatch: {
            domain,
          }
        }
      },
      {
        $inc: {
          count: 1,
          'domains.$.count': 1
        }
      }
    )

    if (res.matchedCount === 0) {
      await db.collection('stat').updateOne(
        {
          uid: widgetConfig.uid,
          token: widgetConfig.token || widgetConfig.id,
          domains: {
            $not: {
              $elemMatch: {
                domain
              }
            }
          }
        },
        {
          $addToSet: {
            domains: {
              domain,
              count: 1
            }
          },
          $inc: {
            count: 1
          }
        }
      )
    }
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
    geolocation,
    unit = baseConfig.unit,
    location = baseConfig.location,
    language = baseConfig.language
  } = ctx.request.query

  const autoLocation = `${geolocation}` === 'true' || baseConfig.geolocation
  const detected = ctx.request.query._detected || ctx.request.query.detected

  const lan = getAutoLanguage(language === 'auto' ? detected : language) || 'zh-Hans'
  const loc = (autoLocation ? getAutoLocation(ctx.request.ip, location) : location) || 'WX4FBXXFKE4F'

  const qs = {
    key,
    language: lan,
    location: loc,
    unit: unit || 'c',
  }
  logger.info(`[queryWidgetWeather] ${JSON.stringify(widgetConfig)} - ${JSON.stringify(qs)}`)

  let results: any
  try {
    results = await weatherFormatter(UIConfigs, qs)
  } catch (e) {
    if (e.signal === 'LOCATION_ERROR') {
      results = await weatherFormatter(UIConfigs, Object.assign({}, qs, {
        location: 'WX4FBXXFKE4F'
      }))
    } else {
      throw e
    }
  }

  statsdRequest({
    qs,
    domain,
    db: ctx.db,
    widgetConfig,
    excludes: new Set(['key'])
  })

  ctx.body = {
    success: true,
    results
  }
}
