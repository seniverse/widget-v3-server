
import request from './request'
import logger from './logger'
import { RequestOptions } from './types/server'

const requestService = (options: RequestOptions, timeout: number[]) => request(
  options,
  timeout,
  (err, retryCount) => {
    logger.error(`[Retry-${retryCount}] ${options.url} ${err.name} ${err.message}`)
  }
)

export default {
  request: (options: RequestOptions) => {
    if (!options.method) options.method = 'GET'

    logger.info(`[REQUEST] ${JSON.stringify(options)}`)
    return requestService(Object.assign({}, options, {
      json: true
    }), [5000, 5000, 5000])
  }
}
