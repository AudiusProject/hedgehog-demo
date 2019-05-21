const models = require('../models')
const { handleResponse, successResponse, errorResponseBadRequest } = require('../apiHelpers')
var express = require('express');
var router = express.Router();

/**
 * Create record in Authentications table
 * req.body should contain {iv, cipherText, lookupKey}
 */
router.post('/', handleResponse(async (req, res, next) => {
  let body = req.body
  if (body && body.iv && body.cipherText && body.lookupKey) {
    try {
      await models.Authentication.create({ iv: body.iv, cipherText: body.cipherText, lookupKey: body.lookupKey })
      return successResponse()
    } catch (err) {
      console.error('Error signing up a user', err)
      return errorResponseBadRequest('Error signing up a user')
    }
  } else return errorResponseBadRequest('Missing one of the required fields: iv, cipherText, lookupKey')
}))

/**
 * Check if a authentication record exists in the database.
 * @param lookupKey {String} primary key in the db used to lookup auth records
 */
router.get('/', handleResponse(async (req, res, next) => {
  let queryParams = req.query

  if (queryParams && queryParams.lookupKey) {
    const existingAuth = await models.Authentication.findOne({
      where: {
        lookupKey: queryParams.lookupKey
      }
    })

    if (existingAuth) {
      return successResponse(existingAuth)
    } else return errorResponseBadRequest('Email or password is incorrect')
  } else return errorResponseBadRequest('Missing field: lookupKey')
}))

module.exports = router;
