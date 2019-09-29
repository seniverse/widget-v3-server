
import * as utils from './utils'
import TpError from '../error'

const TEMPLATE_KEY = '#'
const KEY_PREFIX = ':'

const dataParser = (target: any, baseTemplate: string, extra: any): string =>
  baseTemplate.split(TEMPLATE_KEY).map((key, index) => {
    if (index % 2 === 0) return key
    const chain = key.split(KEY_PREFIX)

    let funcName = utils.returnEverything.name
    if (chain[0] !== '') {
      funcName = chain.shift()
    }
    if (!utils[funcName]) {
      throw new TpError.WidgetError(`unknown func ${funcName} to parser data`)
    }
    const result = utils[funcName](
      utils.dataExtract(target, chain.filter(i => i)),
      extra
    )
    return Array.isArray(result) ? result.join('') : result
  }).join('')

export const uiParser = (data: any, template: { [key: string]: any } | string, extra: any) => {
  if (typeof template === 'string') return dataParser(data, template, extra)
  if (Array.isArray(template)) return template.map(t => uiParser(data, t, extra))

  return Object.keys(template).reduce((dict, key) => {
    const value = template[key]
    if (Array.isArray(value)) {
      dict[key] = value.map(
        val => uiParser(data, val, extra)
      )
    } else {
      dict[key] = uiParser(data, value, extra)
    }
    return dict
  }, {})
}

export const piplelineParser = (data: any, pipleline: {
  funcName: string
  params: any
}[], extra: any) => {
  const piples = [...pipleline]
  let result = data

  while (piples.length) {
    const { funcName, params } = piples.shift()
    if (!utils[funcName]) {
      throw new TpError.WidgetError(`unknown func ${funcName} to parser data`)
    }
    result = utils[funcName](result, Object.assign({}, params || {}, extra || {}))
  }
  return result
}
