
import { WidgetConfig } from '../../utils/types/data'
import { Controller } from '../../utils/types/server'
import TpError from '../../utils/error'
import TpStatsd from '../../utils/statsd'
import { weatherFormatter } from '../shared/weather'
import logger from '../../utils/logger'

const statsdRequest = (widgetConfig: WidgetConfig) => {
  TpStatsd.increment(`weather.${widgetConfig.id}.${widgetConfig.uid}.total`)
  TpStatsd.increment(`language.${widgetConfig.baseConfig.language}.total`)
  TpStatsd.increment(`type.${widgetConfig.baseConfig.flavor}.${widgetConfig.baseConfig.theme}.total`)
  TpStatsd.increment('request.total')

  TpStatsd.unique('request.user', widgetConfig.uid)
}

const getAutoLocation = (ip: string, location: string) => {
  if (/(\d+\.){3}\d+/.test(ip)) return ip.replace(/^::ffff:/, '')
  return location
}

export const queryWidgetWeather: Controller = async (ctx) => {
  const { id } = ctx.params
  const widgetConfig: WidgetConfig = await ctx.db.collection('widget').findOne({ id })

  if (!widgetConfig) {
    throw new TpError.NotFoundError(`can not find widget config for ${id}`)
  }

  // check domain
  const { origin: domain } = ctx.request
  const { key, baseConfig, UIConfigs, allowedDomains } = widgetConfig
  logger.debug(`[domain] ${domain}, ${allowedDomains}`)
  if (allowedDomains.length && !new Set(allowedDomains).has(domain)) {
    throw new TpError.AuthError(`domain ${domain} is not allowed!`)
  }

  const {
    unit,
    language,
    location,
    geolocation
  } = ctx.request.query

  const autoLocation = `${geolocation}` === 'true' || baseConfig.geolocation
  const autoLanguage = language === 'auto' || baseConfig.language === 'auto'
  const requestLocation = location || baseConfig.location

  const detected = ctx.request.query._detected || ctx.request.query.detected
  const lan = autoLanguage ? detected : (language || baseConfig.language)
  const loc = autoLocation
    ? getAutoLocation(ctx.request.ip, requestLocation)
    : requestLocation

  const qs = {
    key,
    language: lan || 'zh-CHS',
    location: loc || 'beijing',
    unit: unit || baseConfig.unit || 'c',
  }
  logger.info(`[queryWidgetWeather] ${JSON.stringify(widgetConfig)} - ${JSON.stringify(qs)}`)

  const results = await weatherFormatter(UIConfigs, qs)

  statsdRequest(widgetConfig)

  ctx.body = {
    success: true,
    results
  }
}
