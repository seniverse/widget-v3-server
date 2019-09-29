
import { TEMPLATE_DATA } from '../../../constant/data'
import { formatLocal } from '../../../constant/language'
import { getUITemplateConfig } from '../../utils'

export const DATA_SOURCE = 'v3/geo/sun'
export const API_NAME = '日出日落'

export const getConfig = getUITemplateConfig(
  `(${DATA_SOURCE}).results[0].sun`
)

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.TILE,
    fields: {
      today_sun: {
        name: '今日预报',
        rightKeys: ['days_limit'],
        availableSizes: ['2,1'],
        getConfig: (language: string, unit: string) => ({
          '2,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].sun[0]`,
              params: {
                days: 1
              },
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                  header: formatLocal(language, 'today_sun'),
                  content: [
                    {
                      text: '#:sunrise#',
                      suffix: ''
                    },
                    {
                      text: '/',
                      suffix: ''
                    },
                    {
                      text: '#:sunset#',
                      suffix: ''
                    },
                  ]
                }
              }
            }
          ]
        })
      }
    }
  },
  {
    UIType: TEMPLATE_DATA.UITYPE.CAROUSEL,
    fields: {
      sun: {
        name: '逐日预报',
        rightKeys: ['days_limit'],
        availableSizes: ['3,1'],
        getConfig: (language: string, unit: string) => ({
          '3,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].sun`,
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP]: {
                  header: '#calendar:date#',
                  content: [
                    {
                      text: '#:sunrise#',
                      suffix: formatLocal(language, 'sun_rise')
                    },
                    {
                      text: ' / ',
                    },
                    {
                      text: '#:sunset#',
                      suffix: formatLocal(language, 'sun_set')
                    }
                  ]
                }
              }
            }
          ]
        })
      }
    }
  }
]
