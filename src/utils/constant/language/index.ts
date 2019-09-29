
import * as en from './lib/en'
import * as ja from './lib/ja'
import * as zh_chs from './lib/zh-CHS'
import * as zh_cht from './lib/zh-CHT'
import logger from '../../logger'

const LOCALES = {
  'ja': ja,
  'en': en,
  'zh-cht': zh_cht,
  'zh-tw': zh_cht,
  'zh-chs': zh_chs,
  'zh-cn': zh_chs,
  'zh-hans': zh_chs,
  'zh-hant': zh_cht,
}

export const formatLocal = (local: string, key: string) => {
  const loc = local.toLowerCase()

  const locales = LOCALES[loc] || LOCALES['en']
  const result = locales[key]

  logger.debug(`[formatLocal] ${local} - ${key} - ${result}`)
  return result || (key ? key.toUpperCase() : '')
}

const UNIT = {
  c: {
    wind_speed: 'km/h',
    pressure: 'mb',
    visibility: 'km',
    humidity: '%',
    clouds: '%',
    pm25: 'μg/m³',
    pm10: 'μg/m³',
    co: 'mg/m³',
    no2: 'μg/m³',
    o3: 'μg/m³',
    so2: 'μg/m³',
  },
  f: {
    wind_speed: 'mph',
    pressure: 'in',
    visibility: 'mi',
    humidity: '%',
    clouds: '%',
    pm25: 'μg/m³',
    pm10: 'μg/m³',
    co: 'mg/m³',
    no2: 'μg/m³',
    o3: 'μg/m³',
    so2: 'μg/m³',
  }
}

export const formatUnit = (unit: string, key: string): string => UNIT[unit][key] || ''
