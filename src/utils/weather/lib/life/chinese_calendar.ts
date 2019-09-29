
import { TEMPLATE_DATA } from '../../../constant/data'
import { getUITemplateConfig } from '../../utils'

export const RIGHT_NAME = 'v3_life_chinese_calendar'
export const API_NAME = '农历'

export const getConfig = getUITemplateConfig(
  '(life/chinese_calendar).results.chinese_calendar[0]'
)

export const API_CONFIGS = {
  UIType: TEMPLATE_DATA.UITYPE.TILE,
  fields: {
    lunar: {
      name: '农历',
      rightKeys: ['days_limit'],
      availableSizes: ['2,1'],
      getConfig: (language: string, unit: string) => ({
        '2,1': [
          {
            dataSource: '(life/chinese_calendar).results.chinese_calendar[0]',
            params: {
              days: 1
            },
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                header: '#:ganzhi_month##:ganzhi_day#',
                content: [
                  {
                    text: '#:lunar_month_name##:lunar_day_name#',
                    suffix: ' #:zodiac#年'
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
