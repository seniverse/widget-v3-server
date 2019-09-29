
import logger from '../utils/logger'
import { ERRORS } from '../utils/error'
import { Controller } from '../utils/types/server'

export const errorMiddleware: Controller = async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.body = {
        success: false,
        error: ERRORS.NotFoundError[0],
        message: ''
      }
    }
  } catch (err) {
    ctx.status = 200
    ctx.body = {
      success: false,
      error: err.errorCode,
      message: err.message || '',
      signal: err.signal || ctx.state.signal,
      results: err.extra
    }

    if (!err.errorCode) {
      ctx.body.error = ERRORS.SystemError[0]
    }
    logger.error(err)
    logger.error(JSON.stringify(ctx.body))
    ctx.app.emit('error', err, ctx)
  }
}
