
import config from '../config'
import logger from '../utils/logger'
import TpError from '../utils/error'
import { Controller, Ctx } from '../utils/types/server'
import * as encryption from '../utils/encryption'

interface WhiteRequest {
  method: string
  url: RegExp
}

const isWhite = (ctx: Ctx, whiteList: WhiteRequest[]) => {
  const method = ctx.request.method.toUpperCase()
  const { path } = ctx.request
  const checked = whiteList.some(option => option.method === method && option.url.test(path))
  logger.info(`[WHITELIST][method:${method}] ${path} - ${checked}`)
  return checked
}

export const authMiddleware = (options: {
  whiteList: WhiteRequest[]
}): Controller => async (ctx, next) => {
  const checkWhite = isWhite(ctx, options.whiteList)
  if (checkWhite) return await next()
  if (config.env === 'local') return await next()

  const authString = ctx.request.headers.authorization
  const date = ctx.request.headers.date

  const matches = authString
    ? authString.match(/^([^ ]+) ([^:]+):((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/)
    : null
  if (!matches) throw new TpError.AuthError('authorization missing')

  const publicKey = matches[2]

  const platform = Object.keys(config.auth).find(platform => config.auth[platform].key === publicKey)
  const auth = config.auth[platform]
  if (!auth) throw new TpError.AuthError(`can not find publicKey - ${publicKey}`)

  const signature = Buffer.from(matches[3] || '', 'base64').toString('base64')
  logger.debug(`signature: ${signature}, auth: ${JSON.stringify(auth)}`)

  const method = ctx.request.method.toUpperCase()
  const body = method === 'POST' || method === 'PUT'
    ? ctx.request.body
    : ''

  const sign = encryption.getSignature({
    date,
    body,
    privateKey: auth.secret,
    method: ctx.request.method.toUpperCase(),
    contentType: (ctx.request.headers['content-type'] || '').split(';')[0]
  })

  if (sign !== signature) throw new TpError.AuthError('auth check failed')

  ctx.state.auth = Object.assign({}, auth, { platform, name: platform })

  await next()
}
