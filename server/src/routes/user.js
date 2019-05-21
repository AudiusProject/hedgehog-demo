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
      await models.User.create({ email: email, walletAddress: body.walletAddress, lastSeenDate: Date.now() })

      return successResponse()
    } catch (err) {
      console.error('Error signing up a user', err)
      return errorResponseBadRequest('Error signing up a user')
    }
  } else return errorResponseBadRequest('Missing one of the required fields: email, walletAddress')
}))

  /**
   * Second step in the user signup flow. This correlates the User record written during
   * /user/sign_up with a handle
   */
router.post('/associate', handleResponse(async (req, res, next) => {
  let body = req.body
  if (body && body.email && body.handle) {
    const email = body.email.toLowerCase()
    const existingUser = await models.User.findOne({
      where: {
        email: email
      }
    })

    if (!existingUser) {
      return errorResponseBadRequest(`Cannot associate for user that doesn't exist`)
    }

    if (existingUser.walletAddress && existingUser.handle) {
      return errorResponseBadRequest(`Values already associated for user`)
    }
    existingUser.handle = body.handle
    existingUser.isConfigured = true

    await existingUser.save()

    await models.AuthMigration.create({ handle: body.handle })

    return successResponse()
  } else return errorResponseBadRequest('Missing one of the required fields: email, handle')
}))

  /**
   * Check if a email address is taken. email is passed in via query param
   */
router.get('/check', handleResponse(async (req, res, next) => {
  let email = req.query.email
  if (email) {
    email = email.toLowerCase()
    const existingUser = await models.User.findOne({
      where: {
        email: email
      }
    })

    if (existingUser) {
      return successResponse({ exists: true })
    } else return successResponse({ exists: false })
  } else return errorResponseBadRequest('Please pass in a valid email address')
}))

module.exports = router;