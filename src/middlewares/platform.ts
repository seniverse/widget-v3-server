
import * as useragent from 'useragent'
import * as MobileDetect from 'mobile-detect'
import logger from '../utils/logger'
import { Controller } from '../utils/types/server'
import TpStatsd from '../utils/statsd'

export const platformMiddleware: Controller = async (ctx, next) => {
  const md = new MobileDetect(ctx.request.headers['user-agent'])
  const agent = useragent.parse(ctx.request.headers['user-agent'])
  const userAgent = {
    browser: md.userAgent() || agent.toAgent(),
    platform: md.os() || agent.os.toString(),
    isMobile: md.mobile(),
    device: md.mobile() ? 'mobile' : 'desktop'
  }

  await next()

  logger.info(`[${userAgent.device}] ${userAgent.platform} - ${userAgent.browser}`)
  const platform = userAgent.platform.split('.')[0]
  const browser = userAgent.browser.split('.')[0]
  TpStatsd.increment(`platform.${userAgent.device}.${platform}.${browser}`)
}
