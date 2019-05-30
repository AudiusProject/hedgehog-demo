const models = require('../models')
const { handleResponse, successResponse, errorResponseBadRequest } = require('../apiHelpers')
var express = require('express')
var router = express.Router()

/**
 * Create record in Users table
 * body should contain {username, walletAddress}
 */
router.post('/', handleResponse(async (req, res, next) => {
  let body = req.body
  console.log(body)
  if (body.username && body.walletAddress) {
    const username = body.username.toLowerCase()
    const existingUser = await models.User.findOne({
      where: {
        username: username
      }
    })

    if (existingUser) {
      return errorResponseBadRequest('Account already exists for user, try logging in')
    }

    try {
      await models.User.create({ username: username, walletAddress: body.walletAddress })

      return successResponse()
    } catch (err) {
      console.error('Error signing up a user', err)
      return errorResponseBadRequest('Error signing up a user')
    }
  } else return errorResponseBadRequest('Missing one of the required fields: username, walletAddress')
}))

module.exports = router
