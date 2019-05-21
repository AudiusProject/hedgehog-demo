const models = require('../models')
const { handleResponse, successResponse, errorResponseBadRequest } = require('../apiHelpers')
var express = require('express');
var router = express.Router();

/**
   * Create a new user in the Users table
   * This is one part of a two part route along with POST /authentication
   * The user handle is not written here. that's added with
   */
router.post('/', handleResponse(async (req, res, next) => {
  // body should contain {email, walletAddress}
  let body = req.body
  if (body.email && body.walletAddress) {
    const email = body.email.toLowerCase()
    const existingUser = await models.User.findOne({
      where: {
        email: email
      }
    })

    if (existingUser) {
      return errorResponseBadRequest('Account already exists for user, try logging in')
    }

    try {
      await models.User.create({ email: email, walletAddress: body.walletAddress })

      return successResponse()
    } catch (err) {
      console.error('Error signing up a user', err)
      return errorResponseBadRequest('Error signing up a user')
    }
  } else return errorResponseBadRequest('Missing one of the required fields: email, walletAddress')
}))

module.exports = router;