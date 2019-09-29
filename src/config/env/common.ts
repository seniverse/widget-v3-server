export default {
  port: process.env.PORT || '3001',
  serverName: 'widget-v3-server',
  auth: {},
  store: {
    mongo: {
      dbName: 'widget',
      url: 'mongodb://localhost/widget'
    },
  },
  services: {
    graphite: null,
    seniverse: {
      url: 'https://api.seniverse.com',
      params: {
        key: ''
      }
    },
    widget: {
      url: '//cdn.sencdn.com/widget2-dev/static/js/bundle.js'
    }
  },
  logger: {
    appenders: {
      cheese: {
        type: 'console'
      }
    },
    categories: {
      default: {
        appenders: ['cheese'],
        level: 'debug'
      }
    }
  }
}
