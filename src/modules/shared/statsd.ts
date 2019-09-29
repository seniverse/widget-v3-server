
import TpStatsd from '../../utils/statsd'
import { Controller, Ctx } from '../../utils/types/server'

export const stat = (name: string, getKeyFunc?: (ctx: Ctx) => string): Controller => async (ctx, next) => {
  const jobStartAt = new Date().getTime()
  const method = ctx.request.method.toLowerCase()
  const suffix = getKeyFunc ? getKeyFunc(ctx) : ''
  let key = `api.${method}.${name}`
  key = suffix ? `${key}.${suffix}` : key

  await next()

  TpStatsd.increment(key)
  TpStatsd.timing(key, new Date().getTime() - jobStartAt)
}

export const getQuery = (...qs: string[]) => (ctx: Ctx): string =>
  qs.map(q => ctx.request.query[q]).join('')

export const getParams = (...params: string[]) => (ctx: Ctx): string =>
  params.map(p => ctx.params[p]).join('')
