
//
//   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
// ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
// ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
// ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
// ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
//  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
//  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
//  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
//           ░     ░ ░      ░  ░
//                 ░

import * as Koa from 'koa'
import * as koaLogger from 'koa-logger'
import * as koaJson from 'koa-json'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import initRouter from './modules'
import config from './config'
import logger from './utils/logger'
import { errorMiddleware } from './middlewares/error'
import { mongoMiddleware } from './middlewares/mongo'
import { loggerMiddleware } from './middlewares/logger'
import { authMiddleware } from './middlewares/auth'
import { getMongo, initDatabaseIndexs } from './utils/mongo'

const app = new Koa()

app['name'] = config.serverName
app['proxy'] = true

app.use(cors({
  credentials: true
}))
app.use(koaJson())
app.use(bodyParser())
app.use(koaLogger())

app.use(errorMiddleware)
app.use(authMiddleware({
  whiteList: [
    {
      method: 'GET',
      url: /^\/api\/weather\/[0-9a-z]{8}-([0-9a-z]{4}-){3}[0-9a-z]{12}$/
    }
  ]
}))
app.use(mongoMiddleware)
app.use(loggerMiddleware({}))
initRouter(app)

const init = async () => {
  try {
    await getMongo(config.store.mongo)
    await initDatabaseIndexs(config.store.mongo)
    app.listen(config.port, () => {
      logger.info(`[SERVER RUNNING][${config.port}]`)
    })
  } catch (err) {
    logger.error(`[ERROR][${err || err.stack}]`)
  }
}

init()

export default app
