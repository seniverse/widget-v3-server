
import { TEMPLATE_DATA } from '../../../constant/data'
import { getUITemplateConfig } from '../../utils'

export const RIGHT_NAME = 'v3_life_driving_restriction'
export const API_NAME = '尾号限行'

export const getConfig = getUITemplateConfig(
  '(life/driving_restriction).results[0].restriction'
)

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.TILE,
    fields: {
      limits: {
        name: '今日限行',
        rightKeys: ['days_limit'],
        getConfig: (language: string, unit: string) => ({
          '1,1': [
            {
              dataSource: '(life/driving_restriction).results[0].restriction',
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.PIPLELINE,
                [TEMPLATE_DATA.TEMPLATE.PIPLELINE]: [
                  {
                    funcName: 'drivingRestrictionFormatter',
                    params: {}
                  }
                ]
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
      limits: {
        name: '三日限行',
        rightKeys: ['days_limit'],
        availableSizes: ['3,1'],
        getConfig: (language: string, unit: string) => ({
          '3,1': [
            {
              dataSource: '(life/driving_restriction).results[0].restriction',
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.PIPLELINE,
                [TEMPLATE_DATA.TEMPLATE.PIPLELINE]: [
                  {
                    funcName: 'restrictionFormatterForCarousel',
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
