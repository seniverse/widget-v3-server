
import { TEMPLATE_DATA } from '../../../constant/data'
import { getUITemplateConfig } from '../../utils'

export const RIGHT_NAME = 'v3_air_hourly'
export const API_NAME = '逐小时预报'

export const getConfig = getUITemplateConfig(
  '(v3/air/hourly).results[0].hourly'
)

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.CHART,
    fields: {
      weather: {
        name: '空气质量',
        rightKeys: ['days_limit'],
        availableSizes: ['3,2'],
        getConfig: (language: string, unit: string) => ({
          '3,2': [
            {
              dataSource: '(v3/air/hourly).results[0].hourly',
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.PIPLELINE,
                [TEMPLATE_DATA.TEMPLATE.PIPLELINE]: [
                  {
                    funcName: 'airHourlyFormatterForChart',
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
