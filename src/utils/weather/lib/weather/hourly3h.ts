
import { TEMPLATE_DATA } from '../../../constant/data'
import { getUITemplateConfig } from '../../utils'

export const RIGHT_NAME = 'v3_weather_hourly3h'
export const API_NAME = '逐3小时预报'

export const getConfig = getUITemplateConfig(
  '(weather/hourly3h).results[0].data'
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
              dataSource: '(weather/hourly3h).results[0].data',
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.PIPLELINE,
                [TEMPLATE_DATA.TEMPLATE.PIPLELINE]: [
                  {
                    funcName: 'weatherHourlyFormatterForChart',
                    params: {}
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
