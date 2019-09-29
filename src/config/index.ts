
import * as merge from 'object-merge'
import { Config } from '../utils/types/server'
import printer from '../utils/printer'

const env: string = process.env.NODE_ENV || 'local'
console.log(`Server running at: ${env}`)

const common: Config = require('./env/common').default
const config: Config = require(`./env/${env}`).default

let mergedConfig = merge({}, common, config, { env }) as Config
mergedConfig = merge({}, mergedConfig, {
  services: {
    seniverse: merge({}, mergedConfig.services.seniverse, {
      params: {
        key: process.env.SENIVERSE_API_KEY
      }
    })
  }
}) as Config
printer.print(mergedConfig)

export default mergedConfig
