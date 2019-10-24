
import request from './request'
import logger from './logger'
import { RequestOptions } from './types/server'

const errorPainter = (err: Error, retryCount: number, url: string) => {
  logger.error(`[Retry-${retryCount}] ${url} ${err.name} ${err.message}`)
}

const requestService = (
  options: RequestOptions,
  timeout: number[],
  onError: (err: Error | null | undefined, count: number, url: string) => void
) => request(
  options,
  timeout,
  onError
)

export default {
  request: (options: RequestOptions, onError = errorPainter) => {
    if (!options.method) options.method = 'GET'

    logger.info(`[REQUEST] ${JSON.stringify(options)}`)
    return requestService(Object.assign({}, options, {
      json: true
    }), [5000, 5000, 5000], onError)
  }
}
