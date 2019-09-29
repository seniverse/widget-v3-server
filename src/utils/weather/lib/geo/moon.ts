
import { TEMPLATE_DATA } from '../../../constant/data'
import { formatLocal, formatUnit } from '../../../constant/language'
import { getUITemplateConfig } from '../../utils'

export const RIGHT_NAME = 'v3_geo_moon'
export const API_NAME = '月出月落'

export const getConfig = getUITemplateConfig(
  '(geo/moon).results[0].moon'
)

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.TILE,
    fields: {
      today_moon: {
        name: '今日预报',
        rightKeys: ['days_limit'],
        availableSizes: ['2,1'],
        getConfig: (language: string, unit: string) => ({
          '2,1': [
            {
              dataSource: '(geo/moon).results[0].moon[0]',
              params: {
                days: 1
              },
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                  header: formatLocal(language, 'today_moon'),
                  content: [
                    {
                      text: '#:rise#',
                      suffix: ''
                    },
                    {
                      text: '/',
                      suffix: ''
                    },
                    {
                      text: '#:set#',
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
      moon: {
        name: '逐日预报',
        rightKeys: ['days_limit'],
        availableSizes: ['3,1'],
        getConfig: (language: string, unit: string) => ({
          '3,1': [
            {
              dataSource: '(geo/moon).results[0].moon',
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP]: {
                  header: '#calendar:date#',
                  content: [
                    {
                      text: '#:rise#',
                      suffix: formatLocal(language, 'moon_rise')
                    },
                    {
                      text: ' / ',
                    },
                    {
                      text: '#:set#',
                      suffix: formatLocal(language, 'moon_set')
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
