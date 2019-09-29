
import * as Koa from 'koa'

export type Next = () => Promise<any>
export type Ctx = Koa.Context

export interface Controller {
  (ctx: Ctx, next?: Next): void
}

export interface RequestConfig {
  method: string
  url: RegExp
}

export interface Route {
  method: string
  route: string
  handlers: Controller[]
}

export interface RequestOptions {
  method?: string
  url: string
  qs?: object
  body?: object
  headers?: object
  timeout?: number
}

/* config */
export interface Identify {
  readonly key: string
  readonly secret: string
}

interface Services {
  readonly graphite?: {
    host: string
    port: string | number
    prefix: string
  }
  readonly seniverse: {
    url: string
    params: {
      key?: string
    }
  }
  readonly widget: {
    url: string
  }
}

interface Store {
  readonly mongo: {
    url: string
    dbName: string
  }
}

interface Logger {
  readonly appenders: {
    readonly cheese: {
      readonly type: string
    }
  }
  readonly categories: {
    readonly default: {
      readonly appenders: string[],
      readonly level: string
    }
  }
}

export interface Config {
  readonly auth: {
    [platform: string]: {
      key: string
      secret: string
    }
  }
  readonly env: string
  readonly port: string | number
  readonly serverName: string
  readonly services: Services
  readonly store: Store
  readonly logger: Logger
}
