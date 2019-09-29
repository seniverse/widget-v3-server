
import { TEMPLATE_DATA } from '../../../constant/data'
import { formatLocal } from '../../../constant/language'
import { getUITemplateConfig } from '../../utils'

export const DATA_SOURCE = 'v3/life/suggestion'
export const API_NAME = '生活指数'

export const getConfig = getUITemplateConfig(
  `(${DATA_SOURCE}).results[0].suggestion`
)

const getContent = (language: string, unit: string, field: string) => ({
  header: formatLocal(language, field),
  content: [
    {
      text: `#:${field}:brief#`,
      suffix: ''
    }
  ]
})

export const API_CONFIGS = [
  {
    UIType: TEMPLATE_DATA.UITYPE.CAROUSEL,
    fields: {
      suggestion: {
        name: '全部数据',
        rightKeys: ['basic', 'advanced'],
        availableSizes: ['3,1'],
        getConfig: (language: string, unit: string) => ({
          '3,1': [
            {
              dataSource: `(${DATA_SOURCE}).results[0].suggestion`,
              params: {},
              template: {
                type: TEMPLATE_DATA.TEMPLATE.PIPLELINE,
                [TEMPLATE_DATA.TEMPLATE.PIPLELINE]: [
                  {
                    funcName: 'suggestionFormatterForCarousel',
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
    UIType: TEMPLATE_DATA.UITYPE.TILE,
    fields: {
      ac: {
        getContent,
        rightKeys: ['advanced'],
        name: '空调指数',
      },
      air_pollution: {
        getContent,
        rightKeys: ['advanced'],
        name: '空气污染'
      },
      airing: {
        getContent,
        rightKeys: ['advanced'],
        name: '晾晒'
      },
      allergy: {
        getContent,
        rightKeys: ['advanced'],
        name: '过敏指数'
      },
      beer: {
        getContent,
        rightKeys: ['advanced'],
        name: '啤酒'
      },
      boating: {
        getContent,
        rightKeys: ['advanced'],
        name: '划船'
      },
      car_washing: {
        getContent,
        rightKeys: ['basic', 'advanced'],
        name: '洗车指数'
      },
      chill: {
        getContent,
        rightKeys: ['advanced'],
        name: '风寒'
      },
      comfort: {
        getContent,
        rightKeys: ['advanced'],
        name: '舒适度'
      },
      dating: {
        getContent,
        rightKeys: ['advanced'],
        name: '约会'
      },
      dressing: {
        getContent,
        rightKeys: ['basic', 'advanced'],
        name: '穿衣指数'
      },
      fishing: {
        getContent,
        rightKeys: ['advanced'],
        name: '钓鱼指数'
      },
      flu: {
        getContent,
        rightKeys: ['basic', 'advanced'],
        name: '感冒指数'
      },
      hair_dressing: {
        getContent,
        rightKeys: ['advanced'],
        name: '美发'
      },
      kiteflying: {
        getContent,
        rightKeys: ['advanced'],
        name: '放风筝'
      },
      makeup: {
        getContent,
        name: '化妆指数',
        availableSizes: ['2,1']
      },
      mood: {
        getContent,
        rightKeys: ['advanced'],
        name: '心情指数'
      },
      morning_sport: {
        getContent,
        rightKeys: ['advanced'],
        name: '晨练指数'
      },
      night_life: {
        getContent,
        rightKeys: ['advanced'],
        name: '夜生活'
      },
      road_condition: {
        getContent,
        rightKeys: ['advanced'],
        name: '路况'
      },
      shopping: {
        getContent,
        rightKeys: ['advanced'],
        name: '购物指数'
      },
      sport: {
        getContent,
        rightKeys: ['basic', 'advanced'],
        name: '运动指数'
      },
      sunscreen: {
        getContent,
        rightKeys: ['advanced'],
        name: '防晒指数'
      },
      traffic: {
        getContent,
        rightKeys: ['advanced'],
        name: '交通'
      },
      travel: {
        getContent,
        rightKeys: ['basic', 'advanced'],
        name: '旅游指数'
      },
      umbrella: {
        getContent,
        rightKeys: ['advanced'],
        name: '雨伞指数'
      },
      uv: {
        getContent,
        rightKeys: ['basic', 'advanced'],
        name: '紫外线强度'
      },
    }
  }
]
