
import { TEMPLATE_DATA } from '../../../constant/data'
import { formatLocal, formatUnit } from '../../../constant/language'
import { getUITemplateConfig } from '../../utils'

export const DATA_SOURCE = 'v3/weather/now'
export const API_NAME = '天气实况'

export const getConfig = getUITemplateConfig(
  `(${DATA_SOURCE}).results[0].now`
)

export const API_CONFIGS = {
  UIType: TEMPLATE_DATA.UITYPE.TILE,
  fields: {
    weather: {
      rightKeys: ['basic', 'advanced'],
      name: '天气现象',
      getContent: (language: string) => ({
        header: formatLocal(language, 'weather'),
        content: [
          {
            type: 'icon',
            text: '#:code#',
            suffix: '#:text#'
          }
        ]
      })
    },
    temperature: {
      name: '温度',
      rightKeys: ['basic', 'advanced'],
      getContent: (language: string) => ({
        header: formatLocal(language, 'temperature'),
        content: [
          {
            text: '#:temperature#°',
            suffix: ''
          }
        ]
      })
    },
    feels_like: {
      name: '体感温度',
      rightKeys: ['advanced'],
      getContent: (language: string) => ({
        header: formatLocal(language, 'feels_like'),
        content: [
          {
            text: '#:feels_like#°',
            suffix: ''
          }
        ]
      })
    },
    pressure: {
      name: '气压',
      rightKeys: ['advanced'],
    },
    humidity: {
      name: '相对湿度',
      rightKeys: ['advanced'],
    },
    visibility: {
      name: '能见度',
      rightKeys: ['advanced'],
    },
    wind_direction: {
      name: '风',
      rightKeys: ['advanced'],
      availableSizes: ['1,1', '2,1'],
      getConfig: (language: string, unit: string) => ({
        '1,1': [
          {
            dataSource: `(${DATA_SOURCE}).results[0].now`,
            params: {},
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                header: formatLocal(language, 'wind_direction'),
                content: [
                  {
                    text: '#:wind_scale#',
                    suffix: ` ${formatLocal(language, 'wind_scale')}`
                  }
                ]
              }
            }
          }
        ],
        '2,1': [
          {
            dataSource: `(${DATA_SOURCE}).results[0].now`,
            params: {},
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                header: formatLocal(language, 'wind_direction'),
                content: [
                  {
                    text: '#:wind_scale#',
                    suffix: ` ${formatLocal(language, 'wind_scale')}`
                  },
                  {
                    text: '',
                    suffix: '  '
                  },
                  {
                    text: '#:wind_speed#',
                    suffix: ` ${formatUnit(unit, 'wind_speed')}`
                  }
                ]
              }
            }
          }
        ]
      })
    },
    clouds: {
      name: '云量',
      rightKeys: ['advanced'],
    },
    dew_point: {
      name: '露点温度',
      rightKeys: ['advanced'],
      getContent: (language: string) => ({
        header: formatLocal(language, 'dew_point'),
        content: [
          {
            text: '#:dew_point#°',
            suffix: ''
          }
        ]
      })
    }
  }
}
