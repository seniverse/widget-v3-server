
import * as controller from './controller'
import { Route } from '../../utils/types/server'
import * as statsd from '../shared/statsd'
import check from '../shared/check'

export const baseUrl: string = '/api/widget'

const modules: Route[] = [
  {
    method: 'POST',
    route: '/',
    handlers: [
      check.body(['key', 'uid', 'iid']),
      statsd.stat('updateWidget'),
      controller.updateWidget
    ]
  },
  {
    method: 'POST',
    route: '/:id/token',
    handlers: [
      statsd.stat('updateWidgetToken'),
      controller.updateWidgetToken
    ]
  },
  {
    method: 'GET',
    route: '/config',
    handlers: [
      check.query(['uid']),
      statsd.stat('config'),
      controller.getBaseConfig
    ]
  },
  {
    method: 'GET',
    route: '/rights',
    handlers: [
      check.query(['rights']),
      controller.getUIConfig
    ]
  },
  {
    method: 'GET',
    route: '/weather',
    handlers: [
      check.query(['dataTypes', 'qs']),
      controller.getWeatherData
    ]
  }
]

export default modules
