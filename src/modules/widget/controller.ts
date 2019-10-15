
import * as uuid from 'uuid'
import config from '../../config'
import TpError from '../../utils/error'
import { Controller } from '../../utils/types/server'
import { WidgetConfigSchema } from '../../utils/constant/schema'
import { WidgetConfig, WidgetBaseConfig } from '../../utils/types/data'
import {
  WIDGET_DATAS,
  DEFAULT_WIDGET_BASE_CONFIG,
  getWidgetBaseConfigOptions
} from '../../utils/constant/data'
import logger from '../../utils/logger'
import {
  getWidgetUIConfigOptions
} from '../../utils/constant/rights'
import { buildWidgetComponents } from '../../utils/weather'
import { weatherFormatter } from '../shared/weather'
import { QsSchema, RightsSchema } from '../../utils/constant/schema'

export const updateWidget: Controller = async (ctx) => {
  const {
    key,
    uid,
    iid,
    baseConfig,
    UIConfigs,
    allowedDomains,
  } = ctx.request.body as any

  const check = WidgetConfigSchema.validate({
    key,
    uid,
    iid,
    baseConfig,
    UIConfigs,
    allowedDomains: allowedDomains || []
  })
  if (check.error) throw new TpError.WidgetError(check.error)

  const uiTmp: Set<string> = new Set([
    WIDGET_DATAS.MAIN.dataType,
    ...(UIConfigs as string[])
  ])
  const widgetUIConfigs = [
    ...uiTmp.values()
  ].map(dataType => ({
    dataType
  }))

  const update = {
    key,
    iid,
    baseConfig,
    UIConfigs: widgetUIConfigs,
    updatedAt: new Date()
  }
  if (allowedDomains) update['allowedDomains'] = allowedDomains

  // one user can only create one widget
  const result = await ctx.db.collection('widget').findOneAndUpdate(
    { uid },
    {
      $set: update,
      $setOnInsert: {
        id: uuid.v4(),
        token: uuid.v4(),
        createdAt: new Date()
      }
    },
    { upsert: true, returnOriginal: false }
  )

  ctx.body = {
    success: true,
    results: result.value.token || result.value.id
  }
}

export const updateWidgetToken: Controller = async (ctx) => {
  const { id } = ctx.params

  const result = await ctx.db.collection('widget').findOneAndUpdate(
    { id },
    {
      $set: {
        token: uuid.v4(),
        updatedAt: new Date()
      }
    },
    { upsert: false, returnOriginal: false }
  )
  ctx.body = {
    success: true,
    results: result.value.token
  }
}

export const getBaseConfig: Controller = async (ctx) => {
  const { uid } = ctx.request.query

  let baseConfig: WidgetBaseConfig = Object.assign({}, DEFAULT_WIDGET_BASE_CONFIG)
  const result: WidgetConfig = await ctx.db.collection('widget').findOne({ uid })
  if (result) {
    baseConfig = result.baseConfig
  }

  const results = {
    uid,
    id: result ? result.id : '',
    iid: result ? result.iid : '',
    key: result ? result.key : '',
    sourceUrl: config.services.widget.url,
    baseConfig: getWidgetBaseConfigOptions(baseConfig)
  }
  logger.info(`[getBaseConfig] ${uid} - ${JSON.stringify(baseConfig)} - ${JSON.stringify(results)}`)

  ctx.body = {
    results,
    success: true,
  }
}

export const getUIConfig: Controller = async (ctx) => {
  const { id } = ctx.request.query
  const rights = JSON.parse(ctx.request.query.rights)
  const rightsCheck = RightsSchema.validate(rights)
  if (rightsCheck.error) throw new TpError.WidgetError(rightsCheck.error)

  const dataRight = buildWidgetComponents(rights)
  const dataRights = Object.keys(dataRight)

  let selected: Set<string> = new Set()
  if (id) {
    const result: WidgetConfig = await ctx.db.collection('widget').findOne({ id })
    if (result) {
      const allRights = new Set(dataRights)
      const dataTypes = result.UIConfigs.map(data => data.dataType)
      selected = new Set(dataTypes)

      for (const dataType of dataTypes) {
        if (!allRights.has(dataType)) selected.delete(dataType)
      }
    }
  }

  const options = getWidgetUIConfigOptions(dataRight, selected)
  logger.info(`[getUIConfig] ${rights} - ${JSON.stringify(options)}`)

  ctx.body = {
    success: true,
    results: {
      options
    }
  }
}

export const getWeatherData: Controller = async (ctx) => {
  const { dataTypes } = ctx.request.query
  const qs = JSON.parse(ctx.request.query.qs)

  const qsCheck = QsSchema.validate(qs)
  if (qsCheck.error) throw new TpError.WidgetError(qsCheck.error)

  const UIConfigs = [
    ...new Set(
      [WIDGET_DATAS.MAIN.dataType, ...dataTypes.split(',')]
    )
  ].filter(s => s).map(s => ({ dataType: s }))
  const results = await weatherFormatter(UIConfigs, qs)

  ctx.body = {
    success: true,
    results
  }
}
