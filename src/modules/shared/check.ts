
import { Controller } from '../../utils/types/server'
import logger from '../../utils/logger'
import TpError from '../../utils/error'

const OPTIONS: {
  obj: object,
  params: string[],
  message: string,
  callback?: () => void
} = {
  obj: {},
  params: [],
  message: '',
  callback: null
}

const baseCheck = (options = OPTIONS): boolean => {
  const {
    obj,
    params,
    message,
    callback
  } = Object.assign({}, OPTIONS, options)

  for (const key of params) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      if (callback) {
        logger.error(message.replace(/%s/, key))
        callback()
        return false
      } else {
        throw new TpError.ParamsError(message.replace(/%s/, key))
      }
    }
  }
  return true
}

const checkQuery = (params: string[]): Controller => async (ctx, next) => {
  baseCheck({
    params,
    obj: ctx.query,
    message: 'required query %s is missed.'
  })
  await next()
}

const checkBody = (params: string[]): Controller => async (ctx, next) => {
  baseCheck({
    params,
    obj: ctx.request.body,
    message: 'required body %s is missed.'
  })
  await next()
}

const checkHeader = (params: string[]): Controller => async (ctx, next) => {
  baseCheck({
    params,
    obj: ctx.request.headers,
    message: 'required header %s is missed.'
  })
  await next()
}

export default {
  query: checkQuery,
  body: checkBody,
  header: checkHeader
}
