
/**
 * Abstract custom error, as parent class for all known errors.
 */
class TpError extends Error {
  origin: Error

  constructor(message?: string | Error) {
    if (message instanceof Error) {
      super(message.message)
      this.origin = message
    } else {
      super(message)
    }
  }
}

export const ERRORS = {
  SystemError: ['SYSTEM_ERROR'],
  // service
  RetryTimeoutError: ['RETRY_TIMEOUT'],
  RetryError: ['RETRY_ERROR'],
  MirageError: ['MIRAGE_ERROR'],
  ServiceUnknownError: ['SERVICE_ERROR'],
  ServiceTimeoutError: ['SERVICE_ERROR'],
  ServiceNotExistError: ['SERVICE_ERROR'],
  NotFoundError: ['404_ERROR'],
  ParamsError: ['PARAMS_ERROR'],
  UnhandleError: ['UNHANDLE_ERROR'],
  DBError: ['DB_ERROR'],
  AuthError: ['AUTHORIZATION_ERROR'],
  // widget error
  WidgetError: ['WIDGET_ERROR']
}

/**
 * @private
 * @param {String} errName subclass name of error
 * @param {String} errorCode, error code for end-user,
 */
function createError(errName: string) {
  const errorCode = ERRORS[errName][0]

  class NewError extends TpError {
    errName: string
    extra?: any
    signal?: string
    errorCode: string

    constructor(message, options: {
      extra?: any
      signal?: string
    } = {}) {
      super(message)
      this.extra = options.extra
      this.signal = options.signal
      this.errName = errName
      this.errorCode = errorCode
    }
  }

  return NewError
}

const attributeHandler = {
  get(_: any, errName: string) {
    if (!ERRORS[errName]) return Error
    return createError(errName)
  }
}

function target () {}
export default new Proxy(target, attributeHandler)
