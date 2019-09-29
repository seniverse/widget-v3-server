
import { TEMPLATE_DATA } from '../constant/data'
import { TileConfig } from '../types/data'
import { dataProvider } from './provider'
import * as templateParser from './template'
import logger from '../logger'
import TpError from '../error'

export const tileParser = async (tileConfig: TileConfig, query: any) => {
  logger.debug(`[tileParser] ${JSON.stringify(tileConfig)}`)
  const { availableSizes, config, UIType, size } = tileConfig
  const defaultSize = size || availableSizes[0]
  const tileSizeConfigs = config[defaultSize] || config[availableSizes[0]]
  const result = []

  for (const tileSizeConfig of tileSizeConfigs) {
    const { dataSource, params, template } = tileSizeConfig
    const qs = Object.assign({}, query, params)

    try {
      const data = await dataProvider(dataSource, qs)

      const templateConfig = template[template.type]
      let formattedData = null

      switch (template.type) {
        case TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE:
          formattedData = await templateParser.uiParser(data, templateConfig, qs)
          result.push(formattedData)
          break
        case TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP:
          if (!Array.isArray(data)) throw new TpError.WidgetError(`expect array for ${dataSource}, but get ${JSON.stringify(data)}`)
          for (const d of data) {
            formattedData = await templateParser.uiParser(d, templateConfig, qs)
            result.push(formattedData)
          }
          break
        case TEMPLATE_DATA.TEMPLATE.PIPLELINE:
          formattedData = await templateParser.piplelineParser(data, templateConfig, qs)
          if (Array.isArray(formattedData)) {
            result.push(...formattedData)
          } else if (formattedData) {
            result.push(formattedData)
          }
          break
      }
    } catch (e) {
      logger.error(e)
    }
  }

  return {
    UIType,
    data: result,
    size: defaultSize.split(',').map(size => parseInt(size, 10))
  }
}
