
import crypto = require('crypto')
import logger from './logger'

export const getSignature = (options: { privateKey: string, method: string, body?: any, contentType?: string, date: string }) => {
  logger.debug(`[sign] ${JSON.stringify(options)}`)

  const { privateKey, method, body = '', contentType = '', date } = options
  const contentBody = body ? JSON.stringify(body) : ''

  return crypto.createHmac('sha1', privateKey)
    .update(
      new Buffer(
        [
          method,
          crypto.createHash('md5').update(contentBody, 'utf8').digest('hex'),
          contentType,
          date
        ].join('\n'),
        'utf-8'
      )
    ).digest('base64')
}

export const createOptions = (option: { key: string, method: string, secret: string, body?: any, contentType?: string }) => {
  const {
    key,
    method,
    secret,
    body = '',
    contentType = ''
  } = option

  const date = new Date().toString()
  const signature = getSignature({
    body,
    date,
    method,
    contentType,
    privateKey: secret
  })

  const options = {
    body,
    headers: {
      Date: date,
      'Content-Type': contentType,
      Authorization: `Signature ${key}:${signature}`
    }
  }
  return options
}
