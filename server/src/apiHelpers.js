module.exports.handleResponse = (func) => {
  return async function (req, res, next) {
    try {
      const resp = await func(req, res, next)

      if (!isValidResponse(resp)) {
        throw new Error('Invalid response returned by function')
      }

      sendResponse(req, res, resp)
      next()
    } catch (error) {
      next(error)
    }
  }
}

const isValidResponse = (resp) => {
  if (!resp || !resp.statusCode || !resp.object) {
    return false
  }

  return true
}

/**
 * Success response
 */
const sendResponse = (req, res, resp) => {
  res.status(resp.statusCode).send(resp.object)
}

module.exports.successResponse = (obj = {}) => {
  return {
    statusCode: 200,
    object: obj
  }
}

/**
 * Error response
 */
const errorResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    object: { error: message }
  }
}

module.exports.errorResponseBadRequest = (message) => {
  return errorResponse(400, message)
}

module.exports.errorResponseServerError = (message) => {
  return errorResponse(500, message)
}
