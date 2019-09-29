
import { Db } from 'mongodb'
import config from '../config'
import { getMongo } from '../utils/mongo'
import { Controller } from '../utils/types/server'

declare module 'koa' {
  interface Context {
    db: Db
  }
}

export const mongoMiddleware: Controller = async (ctx, next) => {
  ctx.db = await getMongo(config.store.mongo)
  await next()
}
