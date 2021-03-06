
import { TEMPLATE_DATA } from '../../../constant/data'
import { getUITemplateConfig } from '../../utils'

export const DATA_SOURCE = 'v3/weather/hourly'
export const API_NAME = '逐小时预报'
export const DATA_TTL = 15 * 60

export const getConfig = getUITemplateConfig(
  `(${DATA_SOURCE}).results[0].hourly`
)

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.CHART,
    fields: {
      weather: {
        name: '天气',
        rightKeys: ['days_limit'],
        availableSizes: ['3,2'],
        getConfig: (language: string, unit: string) => ({
          '3,2': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].hourly`,
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.PIPLELINE,
                [TEMPLATE_DATA.TEMPLATE.PIPLELINE]: [
                  {
                    funcName: 'weatherHourlyFormatterForChart',
                    params: { unit, language }
                  }
                ]
              }
            }
          ]
        })
      }
    }
  }
]
