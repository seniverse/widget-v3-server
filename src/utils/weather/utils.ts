
import * as fs from 'fs'
import * as path from 'path'
import { TEMPLATE_DATA } from '../constant/data'
import { formatLocal, formatUnit } from '../constant/language'
import logger from './../logger'

export const getUITemplateConfig = (dataSource: string) => (uiKey: string) => (field: {
  key: string
  type?: string
  UIType: string
  availableSizes?: string[]
  getContent?: (language: string, unit: string, field: any) => any
  getConfig?: (language: string, unit: string, field: string) => any
}) => (language: string, unit: string) => {
  const availableSizes = field.availableSizes || ['1,1']

  return {
    availableSizes,
    dataType: `${field.UIType}.${uiKey}.${field.key}`,
    UIType: field.UIType,
    config: field.getConfig ? field.getConfig(language, unit, field.key) : {
      [availableSizes[0]]: [
        {
          dataSource: dataSource,
          params: {},
          template: {
            type: TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE,
            [TEMPLATE_DATA.TEMPLATE.UI_TEMPLATE]: field.getContent
              ? field.getContent(language, unit, field.key)
              : {
                header: formatLocal(language, field.key),
                content: [
                  {
                    type: field.type || 'text',
                    text: `#:${field.key}#`,
                    suffix: ` ${formatUnit(unit, field.key)}`
                  }
                ]
              }
          }
        }
      ]
    }
  }
}

const isExcluded = (regexps: RegExp[], target: string): boolean => {
  for (const regexp of regexps) {
    if (regexp.test(target)) return true
  }
  return false
}

export const shadowImport = (folder: string, options: {
  prefix: string
  excludes: RegExp[]
  nameFormatter?: (name: string, module: any) => string
  requiredExports: string[]
  exportDefault: boolean
  extend?: (pathes: string[], module: any) => any
}): Map<symbol, any> => {
  const {
    prefix,
    extend,
    excludes = [],
    nameFormatter,
    requiredExports,
    exportDefault = true,
  } = options

  return fs.readdirSync(folder)
    .filter(
      name => !isExcluded(excludes, name)
    )
    .reduce((list, name) => {
      const filepath = path.resolve(folder, name)
      if (fs.statSync(filepath).isDirectory()) {
        const exportedData = shadowImport(
          filepath,
          Object.assign({}, options, {
            prefix: `${prefix}.${name}`
          })
        )
        return [
          ...list,
          ...exportedData.entries()
        ]
      }

      try {
        const filename = name.split('.').slice(0, -1).join('.')
        let Module = require(filepath)

        if (exportDefault) Module = Module.default
        if (requiredExports.length) {
          for (const requiredExport of requiredExports) {
            if (Module[requiredExport] === undefined) {
              throw new Error(`Module.${requiredExport} missing for ${filepath}`)
            }
          }
        }
        if (!Module) throw new Error(`Module missing for ${filepath}`)

        const key = nameFormatter ? nameFormatter(filepath, Module) : `${prefix}.${filename}`
        list.push([
          Symbol.for(key),
          extend
            ? extend([...prefix.split('.'), filename], Module)
            : Module
        ])
        logger.info(`Module ${filepath} load as ${key}`)
      } catch (e) {
        logger.error(e)
      } finally {
        return list
      }
    }, []).reduce((map, data) => {
      map.set(data[0], data[1])
      return map
    }, new Map() as Map<symbol, any>)
}
