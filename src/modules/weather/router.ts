
import * as controller from './controller'
import { Route } from '../../utils/types/server'
import * as statsd from '../shared/statsd'
import { platformMiddleware } from '../../middlewares/platform'

export const baseUrl: string = '/api/weather'

const modules: Route[] = [
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      platformMiddleware,
      statsd.stat('weather'),
      controller.queryWidgetWeather
    ]
  }
]

export default modules
