
import * as request from 'request-promise'
import TpError from './error'

/**
 * wrap origin request with retry strage supportting.
 * @param {Object} options option for origin request method.
 * @param {array[integer]} timeout timeout setting for every request.
 * @param {function} onError callback function if error.
 */
const retryRequest = async (
  options: any,
  timeout: number[],
  onError?: (err: Error | null | undefined, count: number) => void
): Promise<any> => {
  let err: Error
  for (let i = 0; i < timeout.length; i += 1) {
    try {
      options.timeout = timeout[i]
      return await request(options)
    } catch (e) {
      err = e
      onError && onError(e, i)
    }
  }
  throw new TpError.RetryTimeoutError(err)
}

export default retryRequest
