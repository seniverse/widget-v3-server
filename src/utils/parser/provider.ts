
import CONFIG from '../../config'
import serviceUtils from '../service'
import { dataExtract } from './utils'
import logger from '../logger'
import TpError from '../error'
import cache from '../cache'

const _dataProvider = async (dataSource: string, qs: any) => {
  const rawRouter = /\((.+)\)/.exec(dataSource)
  if (!rawRouter || !rawRouter[1]) throw new TpError.WidgetError(`invalidate dataSource: ${dataSource}`)
  const url = `${CONFIG.services.seniverse.url}/${rawRouter[1]}.json`

  const options = {
    qs,
    url,
    method: 'GET',
  }
  const data = await serviceUtils.request(options)
  logger.debug(`[dataProvider:request] ${JSON.stringify(options)} - ${JSON.stringify(data)}`)
  if (data.status_code === 'AP010002') throw new TpError.WidgetError(`${data.status} - ${JSON.stringify(options)}`)

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
