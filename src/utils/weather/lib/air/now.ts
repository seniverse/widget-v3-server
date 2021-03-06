
import { TEMPLATE_DATA } from '../../../constant/data'
import { formatLocal } from '../../../constant/language'
import { getUITemplateConfig } from '../../utils'

export const DATA_SOURCE = 'v3/air/now'
export const API_NAME = '空气实况'
export const DATA_TTL = 30 * 60

export const getConfig = getUITemplateConfig(
  `(${DATA_SOURCE}).results[0].air.city`
)

export const API_CONFIGS = {
  UIType: TEMPLATE_DATA.UITYPE.TILE,
  fields: {
    aqi: {
      name: '空气质量',
      rightKeys: ['city', 'all'],
      availableSizes: ['1,1', '2,1'],
      getConfig: (language: string, unit: string) => ({
        '1,1': [
          {
            dataSource: `(${DATA_SOURCE}).results[0].air.city`,
            params: {},
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                header: '#formatAirQuality:quality#',
                content: [
                  {
                    text: '#:aqi#',
                    suffix: 'AQI'
                  }
                ]
              }
            }
          }
        ],
        '2,1': [
          {
            dataSource: `(${DATA_SOURCE}).results[0].air.city`,
            params: {},
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                header: formatLocal(language, 'quality'),
                content: [
                  {
                    text: '#:aqi#',
                    suffix: ' AQI'
                  },
                  {
                    text: '',
                    suffix: '  '
                  },
                  {
                    text: '#:quality#',
                    suffix: ` ${formatLocal(language, 'air')}`
                  }
                ]
              }
            }
          }
        ]
      })
    },
    pm25: {
      name: 'PM2.5',
      rightKeys: ['city', 'all']
    },
    pm10: {
      name: 'PM10',
      rightKeys: ['city', 'all']
    },
    so2: {
      name: 'SO2',
      rightKeys: ['city', 'all']
    },
    no2: {
      name: 'NO2',
      rightKeys: ['city', 'all']
    },
    co: {
      name: 'CO',
      rightKeys: ['city', 'all']
    },
    o3: {
      name: 'O3',
      rightKeys: ['city', 'all']
    },
    primary_pollutant: {
      name: '首要污染物',
      rightKeys: ['city', 'all']
    }
  }
}
