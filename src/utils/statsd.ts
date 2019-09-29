
import { StatsD, StatsDConfig } from 'node-statsd'
import config from '../config'
import logger from './logger'

let client: StatsD
if (config.services.graphite) {
  config.services.graphite.prefix = `${config.serverName}.${config.services.graphite.prefix}`
  logger.info(`[GRAPHITE:CONFIG][${JSON.stringify(config.services.graphite)}]`)
  client = new StatsD(config.services.graphite as StatsDConfig)
}

const callback = (key = null) => (...params) => {
  const error = params[0]
  const bytes = params[1]
  if (error) {
    logger.error(`[GRAPHITE:ERROR][${error}]`)
  } else if (key && bytes) {
    logger.info(`[GRAPHITE:SUCCEED][${key}:${bytes}]`)
  }
}

if (client) {
  client.socket.on('error', callback())
}

export default {
  timing(key: string, ms: number) {
    if (client) {
      client.timing(key, ms, 1, [], callback(key))
    } else {
      logger.info('statsd|timing', key, ms)
    }
  },
  increment(key: string, num: number = 1) {
    if (client) {
      client.increment(key, num, 1, [], callback(key))
    } else {
      logger.info('statsd|increment', key)
    }
  },
  unique(key: string, value: string) {
    if (client) {
      client.unique(key, value)
    } else {
      logger.info(`unique:${key}|${value}`)
    }
  }
}
