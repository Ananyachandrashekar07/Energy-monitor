'use strict';
 
const { validationResult } = require('express-validator');
const { sendError }        = require('../utils/response');
 
/**
 * validate
 * Place after an array of express-validator check() calls.
 * If any check failed, responds with 422 and the error list.
 * Otherwise calls next().
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation failed', 422, errors.array());
  }
  next();
};
 
module.exports = validate;