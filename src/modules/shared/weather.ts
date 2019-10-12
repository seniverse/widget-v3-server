
import * as deepmerge from 'deepmerge'
import CONFIG from '../../config'
import logger from '../../utils/logger'
import { tileParser } from '../../utils/parser'
import { WIDGET_DATAS, TEMPLATE_DATA } from '../../utils/constant/data'
import { buildWidgetComponents } from '../../utils/weather'
import { FULL_RIGHT } from '../../utils/constant/rights'

const widgetComponentConfig = buildWidgetComponents(FULL_RIGHT)
Object.assign(widgetComponentConfig, {
  [WIDGET_DATAS.MAIN.dataType]: {
    dataTTL: WIDGET_DATAS.MAIN.dataTTL,
    getConfig: WIDGET_DATAS.MAIN.getConfig
  }
})

export const weatherFormatter = async (UIConfigs: {
  dataType: string
  size?: string
}[], query: {
  key: string
  unit: string
  location: string
  language: string
}) => {
  const results = []

  for (const UIConfig of UIConfigs) {
    logger.info(`[weatherFormatter:start] ${JSON.stringify(UIConfig)}`)
    const { getConfig, dataTTL } = widgetComponentConfig[UIConfig.dataType]

    const tileConfig = Object.assign(
      { dataTTL },
      getConfig(query.language, query.unit),
      UIConfig
    )

    const qs = tileConfig.UIType === TEMPLATE_DATA.UITYPE.MAIN
      ? Object.assign({}, query, CONFIG.services.seniverse.params)
      : Object.assign({}, CONFIG.services.seniverse.params, query)
    const result = await tileParser(tileConfig, qs)

    switch (tileConfig.UIType) {
      case TEMPLATE_DATA.UITYPE.MAIN:
        results.push({
          ...result,
          data: [
            result.data.reduce((dict, d) => deepmerge(dict, d), {})
          ]
        })
        break
      default:
        result.data.length && results.push(result)
        break
    }
    logger.info(`[weatherFormatter:end] ${JSON.stringify(result)}`)
  }

  return results
}
