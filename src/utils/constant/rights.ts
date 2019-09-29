
export const FULL_RIGHT = {
  secondary: {
    v3_weather_now: {
      scope: 'advanced',
      enabled: true
    },
    v3_weather_daily: {
      days_limit: 15,
      yesterday: true,
      enabled: true
    },
    v3_weather_alarm: {
      enabled: true
    },
    v3_weather_hourly_history: {
      enabled: true
    },
    v3_weather_hourly: {
      enabled: true
    },
    v3_weather_hourly3h: {
      enabled: true
    },
    v3_air_now: {
      scope: 'all',
      enabled: true
    },
    v3_air_ranking: {
      enabled: true
    },
    v3_air_hourly: {
      days_limit: 5,
      enabled: true
    },
    v3_air_hourly_history: {
      enabled: true
    },
    v3_air_daily: {
      days_limit: 5,
      enabled: true
    },
    v3_life_suggestion: {
      scope: 'advanced',
      enabled: true
    },
    v3_life_chinese_calendar: {
      enabled: true
    },
    v3_life_driving_restriction: {
      enabled: true
    },
    v3_geo_moon: {
      enabled: true
    },
    v3_geo_sun: {
      enabled: true
    },
    v3_tide_daily: {
      days_limit: 18,
      enabled: true
    },
    v3_robot_talk: {
      enabled: true
    },
    v3_location_search: {
      enabled: true
    }
  }
}

const UI_NAME = {
  tile: '磁贴',
  carousel: '轮播',
  chart: '图表'
}

export const getWidgetUIConfigOptions = (
  dataRight: {
    [dataType: string]: {
      UIType: string
      apiGroup: string
      apiName: string
    }
  },
  selected: Set<string>,
) => {
  const tmp = Object.keys(dataRight).reduce((dict, dataType) => {
    const item = dataRight[dataType]
    if (!item) return dict

    if (!dict[item.UIType]) {
      dict[item.UIType] = {
        id: item.UIType,
        name: UI_NAME[item.UIType] || item.UIType,
        type: 'checkbox',
        options: [],
        value: []
      }
    }
    dict[item.UIType].options.push({
      id: dataType,
      group: item.apiGroup,
      name: item.apiName
    })
    if (selected.has(dataType)) {
      dict[item.UIType].value.push(dataType)
    }
    return dict
  }, {})

  return Object.values(tmp)
}
