
import CONFIG from '../../config'
import serviceUtils from '../service'
import { dataExtract } from './utils'
import logger from '../logger'
import TpError from '../error'
import cache from '../cache'

const handleError = (err: Error, count: number, url: string): void => {
  logger.error(`[Retry-${count}] ${url} ${err.name} ${err.message}`)

  if (err['error']) {
    const statusCode = err['error'].status_code
    switch (statusCode) {
      // 参数错误，后续请求均不再发出
      case 'AP010001':
        throw new TpError.ServiceRequestError(err.message)
      // 访问量不足、服务过期、超频，后续请求均不再发出
      case 'AP010012':
      case 'AP010013':
      case 'AP010014':
        throw new TpError.ServiceRequestError(err.message)
      // 接口/地点权限或加密错误
      case 'AP010002':
      case 'AP010003':
      case 'AP010004':
      case 'AP010006':
        throw new TpError.ServicePermissionError(err.message)
      // API 404
      case 'AP010005':
        throw new TpError.ServiceNotExistError(err.message)
      // 该接口请求错误
      case 'AP010015':
      case 'AP010016':
      case 'AP010017':
      case 'AP100001':
      case 'AP100002':
      case 'AP100003':
      case 'AP100004':
        throw new TpError.ServiceUnknownError(err.message)
      // 地点错误，后续请求均不再发出
      case 'AP010010':
      case 'AP010011':
        throw new TpError.ServiceRequestError(err.message, {
          signal: 'LOCATION_ERROR'
        })
      default:
        break
    }
  }
}

const _dataProvider = async (dataSource: string, qs: any) => {
  const rawRouter = /\((.+)\)/.exec(dataSource)
  if (!rawRouter || !rawRouter[1]) throw new TpError.WidgetError(`invalidate dataSource: ${dataSource}`)
  const url = `${CONFIG.services.seniverse.url}/${rawRouter[1]}.json`

  const options = {
    qs,
    url,
    method: 'GET',
  }
  const data = await serviceUtils.request(options, handleError)
  logger.debug(`[dataProvider:request] ${JSON.stringify(options)} - ${JSON.stringify(data)}`)

  const dataChain = dataSource
    .replace(rawRouter[0], '')
    .split('.').filter(i => i)
  const result = dataExtract(data, dataChain)

  logger.debug(`[dataProvider:dataExtract] ${dataSource} - ${JSON.stringify(result)}`)
  return result
}

export const dataProviderCache = cache.wrapFn(
  _dataProvider,
  'provider',
  { ttl: 100 }
)
