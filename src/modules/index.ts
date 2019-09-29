
import * as fs from 'fs'
import * as path from 'path'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as Types from '../utils/types/server'

function initRouter(app: Koa) {
  fs.readdirSync(__dirname).forEach((file) => {
    const modPath = path.join(__dirname, file);
    if (file !== 'shared' && fs.statSync(modPath).isDirectory()) {
      /* eslint-disable import/no-dynamic-require, global-require */
      const router = require(`${modPath}/router`)
      const routes = router.default
      const baseUrl = router.baseUrl

      const instance = new Router({ prefix: baseUrl })

      routes.forEach((config: Types.Route) => {
        const {
          method = '',
          route = '',
          handlers = []
        } = config

        const lastHandler = handlers.pop()

        instance[method.toLowerCase()](route, ...handlers, async (ctx: Types.Ctx, next: Types.Next) => {
          await lastHandler(ctx, next)
        })

        app.use(instance.routes())
        app.use(instance.allowedMethods())
      })
    }
  })
}

export default initRouter
