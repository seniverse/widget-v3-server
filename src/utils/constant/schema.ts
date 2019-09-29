
import * as Joi from '@hapi/joi'
import { WIDGET_BASE_CONFIG } from './data'

export const WidgetConfigSchema = Joi.object({
  key: Joi.string().required(),
  uid: Joi.string().required().uuid(),
  iid: Joi.string().required().uuid(),
  allowedDomains: Joi.array().items(Joi.string()).min(0),
  baseConfig: Joi.object(
    Object.keys(WIDGET_BASE_CONFIG).reduce((dict, key) => {
      const { options, type } = WIDGET_BASE_CONFIG[key]
      switch (type) {
        case 'options':
          dict[key] = Joi.string().required().valid(
            options.map(op => op.id)
          )
          break
        case 'switch':
          dict[key] = Joi.boolean().required()
          break
        case 'multiSelector':
          dict[key] = Joi.string().required()
          break
      }
      return dict
    }, {})
  ),
  UIConfigs: Joi.array().items(
    Joi.string()
  ).min(0).required()
})

export const RightsSchema = Joi.object({
  primary: Joi.any(),
  secondary: Joi.object().required()
})

export const QsSchema = Joi.object({
  key: Joi.string().required(),
  location: Joi.string().required(),
  language: Joi.string().required(),
  unit: Joi.string().required()
})
