
import { TEMPLATE_DATA } from '../../../constant/data'
import { formatLocal } from '../../../constant/language'
import { unitFormatter, getUITemplateConfig } from '../../utils'

export const DATA_SOURCE = 'v3/weather/daily'
export const API_NAME = '逐日预报'
export const DATA_TTL = 2 * 60 * 60

export const getConfig = getUITemplateConfig(
  `(${DATA_SOURCE}).results[0].daily`
)

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.TILE,
    fields: {
      today_code: {
        name: '今日天气',
        rightKeys: ['days_limit'],
        availableSizes: ['1,1'],
        getConfig: (language: string, unit: string) => ({
          '1,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].daily[0]`,
              params: {
                days: 1
              },
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                  header: formatLocal(language, 'today_code'),
                  content: [
                    {
                      type: 'icon',
                      text: '#:code_day#',
                      suffix: ''
                    },
                    {
                      text: '',
                      suffix: ' / '
                    },
                    {
                      type: 'icon',
                      text: '#:code_night#',
                      suffix: ''
                    },
                  ]
                }
              }
            }
          ]
        })
      },
      today_temperature: {
        name: '今日温度',
        rightKeys: ['days_limit'],
        availableSizes: ['1,1'],
        getConfig: (language: string, unit: string) => ({
          '1,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].daily[0]`,
              params: {
                days: 1
              },
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                  header: formatLocal(language, 'today_temperature'),
                  content: [
                    {
                      text: `#:low#/#:high#`,
                      suffix: unitFormatter(unit)
                    }
                  ]
                }
              }
            }
          ]
        })
      },
      yesterday_temperature: {
        name: '昨日温度',
        rightKeys: ['yesterday'],
        availableSizes: ['1,1'],
        getConfig: (language: string, unit: string) => ({
          '1,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].daily[0]`,
              params: {
                start: -1,
                days: 1
              },
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                  header: formatLocal(language, 'yesterday_temperature'),
                  content: [
                    {
                      text: `#:low#/#:high#`,
                      suffix: unitFormatter(unit)
                    }
                  ]
                }
              }
            }
          ]
        })
      },
      tomorrow_temperature: {
        name: '明日温度',
        rightKeys: ['days_limit'],
        availableSizes: ['1,1'],
        getConfig: (language: string, unit: string) => ({
          '1,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].daily[0]`,
              params: {
                start: 1,
                days: 1
              },
              template: {
                type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
                [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                  header: formatLocal(language, 'tomorrow_temperature'),
                  content: [
                    {
                      text: `#:low#/#:high#`,
                      suffix: unitFormatter(unit)
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
    UIType: TEMPLATE_DATA.UITYPE.CAROUSEL,
    fields: {
      weather: {
        name: '天气',
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
                      type: 'icon',
                      text: '#:code_day#',
                      suffix: ` #:low#/#:high#${unitFormatter(unit)}`
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
      weather: {
        name: '天气',
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
                        type: 'icon',
                        text: '#:code_day#'
                      },
                      {
                        type: 'text',
                        text: '#:text_day#'
                      },
                      {
                        type: 'text',
                        text: `#:high#${unitFormatter(unit)}`
                      }
                    ],
                    [
                      {
                        type: 'icon',
                        text: '#:code_night#'
                      },
                      {
                        type: 'text',
                        text: '#:text_night#'
                      },
                      {
                        type: 'text',
                        text: `#:low#${unitFormatter(unit)}`
                      }
                    ]
                  ],
                  yAxis: [
                    {
                      data: '#:high#',
                      type: TEMPLATE_DATA.CHART_TYPE.LINE
                    },
                    {
                      data: '#:low#',
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
