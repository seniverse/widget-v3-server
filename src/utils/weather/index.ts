
import * as path from 'path'
import { shadowImport } from './utils'

const PREFIX = 'SENIVERSE.V3'

interface ApiConfig {
  UIType: string
  fields: {
    [key: string]: {
      type?: string
      name: string
      rightKeys: string[]
      availableSizes?: string[]
      getConfig?: (language: string, unit: string, fieldKey: string) => any
      getContent?: (language: string, unit: string, fieldKey: string) => any
    }
  }
}

export const APIS: Map<symbol, {
  API_CONFIGS: ApiConfig[] | ApiConfig
  API_NAME: string
  DATA_SOURCE: string
  DATA_TTL: string
  WIDGET_PREFIX: string
  getConfig: (field: any) => (language: string, unit: string) => any
}> = shadowImport(
  path.resolve(__dirname, './lib'),
  {
    excludes: [/\.map$/],
    prefix: PREFIX,
    exportDefault: false,
    requiredExports: [
      'API_CONFIGS',
      'API_NAME',
      'DATA_SOURCE',
      'DATA_TTL',
      'getConfig'
    ],
    nameFormatter: (_, module) => module.DATA_SOURCE.split('/').join('_'),
    extend: (pathes: string[], module: any) => ({
      ...module,
      WIDGET_PREFIX: pathes.join('.'),
      getConfig: module.getConfig(pathes.join('.'))
    })
  }
)

const rightHit = (apiRights: string[], widgetRights: string[]): boolean => {
  const tmp = new Set(widgetRights)
  for (const apiRight of apiRights) {
    if (tmp.has(apiRight)) return true
  }
  return false
}

export const buildWidgetComponents = (rights: {
  secondary: {
    [key: string]: {
      enabled: boolean
      scope?: string
      days_limit?: number
      yesterday?: boolean
    }
  }
}): {
  [key: string]: {
    UIType: string
    apiGroup: string
    apiName: string
    dataTTL: number
    getConfig: (language: string, unit: string) => any
  }
} => Object.keys(rights.secondary).reduce((dict, rightName) => {
  const right = rights.secondary[rightName]
  if (!right.enabled) return dict
  const rawConfig = APIS.get(Symbol.for(rightName))
  if (!rawConfig) return dict

  const rightKeys = ['days_limit']
  if (right.scope) rightKeys.push(right.scope)
  if (right.yesterday) rightKeys.push('yesterday')

  const API_CONFIGS = Array.isArray(rawConfig.API_CONFIGS) ? rawConfig.API_CONFIGS : [rawConfig.API_CONFIGS]
  const {
    API_NAME,
    getConfig,
    DATA_TTL,
    WIDGET_PREFIX
  } = rawConfig

  for (const API_CONFIG of API_CONFIGS) {
    const { UIType, fields } = API_CONFIG
    for (const fieldKey of Object.keys(fields)) {
      const { rightKeys: fieldRights, name, ...others } = fields[fieldKey]
      if (!rightHit(rightKeys, fieldRights)) {
        continue
      }

      const widgetDataKey = `${UIType}.${WIDGET_PREFIX}.${fieldKey}`
      dict[widgetDataKey] = {
        UIType,
        apiGroup: API_NAME,
        apiName: name,
        dataTTL: DATA_TTL,
        getConfig: getConfig({
          UIType,
          key: fieldKey,
          ...others
        })
      }
    }
  }

  return dict
}, {})
