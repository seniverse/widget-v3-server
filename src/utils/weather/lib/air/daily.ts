
import { TEMPLATE_DATA } from '../../../constant/data'
import { getUITemplateConfig } from '../../utils'

export const DATA_SOURCE = 'v3/air/daily'
export const API_NAME = '逐日预报'

export const getConfig = getUITemplateConfig(
  `(${DATA_SOURCE}).results[0].daily`
)

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.CAROUSEL,
    fields: {
      air: {
        name: '空气质量',
        rightKeys: ['days_limit'],
        availableSizes: ['3,1'],
        getConfig: (language: string, unit: string) => ({
          '3,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].daily`,
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP]: {
                  header: '#calendar:date#',
                  content: [
                    {
                      text: '#:aqi#',
                      suffix: ' #:quality#'
                    }
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
    UIType: TEMPLATE_DATA.UITYPE.CHART,
    fields: {
      aqi: {
        name: '空气质量',
        rightKeys: ['days_limit'],
        availableSizes: ['3,2'],
        getConfig: (language: string, unit: string) => ({
          '3,2': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].daily`,
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE_MAP]: {
                  content: [
                    [
                      {
                        type: 'text',
                        text: '#calendar:date#'
                      }
                    ],
                    [
                      {
                        type: 'text',
                        text: '#:quality#'
                      },
                      {
                        type: 'text',
                        text: '#:aqi#'
                      },
                    ]
                  ],
                  yAxis: [
                    {
                      data: '#:aqi#',
                      inverse: true,
                      type: TEMPLATE_DATA.CHART_TYPE.LINE
                    }
                  ],
                  xAxis: '#dateFormatter:date#'
                }
              }
            }
          ]
        })
      }
    }
  }
]
