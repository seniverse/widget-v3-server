
import * as WEATHER from '../utils/weather'
import { FULL_RIGHT } from '../utils/constant/rights'

console.log(WEATHER.APIS)

const RIGHT = {
  secondary: {
    v3_location_search: {
      enabled: true
    },
    v3_weather_now: {
      scope: 'advanced',
      enabled: true
    },
    v3_weather_daily: {
      days_limit: 15,
      yesterday: true,
      enabled: true
    },
    v3_weather_hourly: {
      enabled: true
    },
    v3_weather_hourly_history: {
      enabled: true
    },
    v3_weather_alarm: {
      enabled: true
    },
    v3_air_now: {
      scope: 'all',
      enabled: true
    },
    v3_air_ranking: {
      enabled: true
    },
    v3_air_hourly_history: {
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
    v3_geo_sun: {
      enabled: true
    },
    v3_geo_moon: {
      enabled: true
    }
  }
}

export const widgetData = WEATHER.buildWidgetComponents(FULL_RIGHT)

console.log(widgetData)
