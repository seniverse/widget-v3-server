
import { WidgetBaseConfig } from '../types/data'
import * as districts from './districts.json'
import { unitFormatter } from '../weather/utils'

export const TIMES = {
  DAY: 24 * 60 * 60,
  HOURS: 60 * 60,
  MS_PERDAY: 24 * 60 * 60 * 1000
}

export const TEMPLATE_DATA = {
  UITYPE: {
    MAIN: 'main',
    TILE: 'tile',
    CAROUSEL: 'carousel',
    CHART: 'chart',
  },
  CHART_TYPE: {
    LINE: 'line',
    BAR: 'bar',
    ICON: 'icon',
    TEXT: 'text',
  },
  TEMPLATE: {
    UI_TEMPLATE: 'UI-TEMPLATE',
    UI_TEMPLATE_MAP: 'UI-TEMPLATE-MAP',
    PIPLELINE: 'PIPLELINE'
  }
}

export const WIDGET_DATAS: {
  [key: string]: {
    name: string
    UIType: string
    dataType: string
    dataTTL: number
    getConfig: (language: string, unit: string) => any
  }
} = {
  MAIN: {
    name: '主组件',
    dataType: 'main.weather',
    UIType: TEMPLATE_DATA.UITYPE.MAIN,
    dataTTL: 200,
    getConfig: (language: string, unit: string) => ({
      availableSizes: ['3,2'],
      dataType: 'main.weather',
      UIType: TEMPLATE_DATA.UITYPE.MAIN,
      config: {
        '3,2': [
          {
            dataSource: '(v3/weather/now).results[0]',
            params: {},
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                location: '#:location:name#',
                locationV3: '#:location:id#',
                updateAt: '#formatUpdateTime:last_update#',
                text: '#:now:text#',
                code: {
                  now: '#:now:code#',
                },
                temperature: '#:now:temperature#°',
              }
            }
          },
          {
            dataSource: '(v3/geo/sun).results[0].sun[0]',
            params: {
              days: 1
            },
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                sun: {
                  rise: '#:sunrise#',
                  set: '#:sunset#',
                }
              }
            }
          },
          {
            dataSource: '(v3/weather/daily).results[0]',
            params: {
              days: 2,
              start: -1
            },
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                yesterday: {
                  low: `#:daily[0]:low#${unitFormatter(unit)}`,
                  high: `#:daily[0]:high#${unitFormatter(unit)}`,
                },
                today: {
                  low: `#:daily[1]:low#${unitFormatter(unit)}`,
                  high: `#:daily[1]:high#${unitFormatter(unit)}`,
                },
                code: {
                  day: '#:daily[1]:code_day#',
                  night: '#:daily[1]:code_night#',
                }
              }
            }
          },
          {
            dataSource: '(v3/life/suggestion).results[0].suggestion',
            params: {},
            template: {
              type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
              [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: {
                suggestion: '#:dressing:details#'
              }
            }
          },
          {
            dataSource: '(v3/weather/alarm).results[0].alarms',
            params: {},
            template: {
              type: TEMPLATE_DATA.TEMPLATE.PIPLELINE,
              [TEMPLATE_DATA.TEMPLATE.PIPLELINE]: [
                {
                  funcName: 'weatherAlarmFormatter',
                  params: {},
                }
              ]
            }
          },
        ]
      }
    })
  }
}

export const WIDGET_BASE_CONFIG = {
  unit: {
    name: '单位',
    type: 'options',
    tip: {
      type: 'link',
      text: '单位说明',
      link: 'https://docs.seniverse.com/api/start/unit.html'
    },
    options: [
      {
        id: 'c',
        name: '摄氏',
        group: ''
      },
      {
        id: 'f',
        name: '华氏',
        group: ''
      }
    ]
  },
  language: {
    name: '插件语言',
    type: 'options',
    tip: {
      type: 'link',
      text: '多语言支持说明',
      link: 'https://docs.seniverse.com/api/start/language.html'
    },
    options: [
      {
        id: 'zh-Hans',
        name: '简体中文',
        group: ''
      },
      {
        id: 'zh-Hant',
        name: '繁體中文',
        group: ''
      },
      {
        id: 'en',
        name: 'English',
        group: ''
      },
      {
        id: 'ja',
        name: '日本語',
        group: ''
      },
      {
        id: 'auto',
        name: '自动检测',
        group: ''
      }
    ]
  },
  location: {
    name: '默认城市',
    type: 'multiSelector',
    options: districts
  },
  flavor: {
    name: '插件类型',
    type: 'options',
    options: [
      {
        id: 'slim',
        name: '固定极简',
        group: ''
      },
      {
        id: 'bubble',
        name: '浮动气泡',
        group: ''
      }
    ]
  },
  theme: {
    name: '插件主题',
    type: 'options',
    options: [
      {
        id: 'auto',
        name: '随天气变化',
        group: ''
      },
      {
        id: 'dark',
        name: '黑色',
        group: ''
      },
      {
        id: 'light',
        name: '白色',
        group: ''
      }
    ]
  },
  geolocation: {
    name: '自动定位',
    type: 'switch',
  },
  hover: {
    name: '展开',
    type: 'options',
    options: [
      {
        id: 'enabled',
        name: '可展开',
        group: ''
      },
      {
        id: 'disabled',
        name: '不可展开',
        group: ''
      },
      {
        id: 'always',
        name: '始终展开',
        group: ''
      }
    ]
  }
}

export const DEFAULT_WIDGET_BASE_CONFIG = {
  flavor: 'bubble',
  theme: 'auto',
  hover: 'enabled',
  location: 'WX4FBXXFKE4F',
  geolocation: false,
  language: 'zh-Hans',
  unit: 'c',
}

export const getWidgetBaseConfigOptions = (baseConfig: WidgetBaseConfig) =>
  Object.keys(baseConfig).reduce((list, key) => {
    if (!WIDGET_BASE_CONFIG[key]) return list

    list.push(Object.assign({}, WIDGET_BASE_CONFIG[key], {
      id: key,
      value: baseConfig[key]
    }))
    return list
  }, [])
