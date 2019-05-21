const models = require('../models')
const { handleResponse, successResponse, errorResponseBadRequest } = require('../apiHelpers')
var express = require('express');
var router = express.Router();

router.post('/', handleResponse(async (req, res, next) => {
  // body should contain {iv, cipherText, lookupKey}
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
