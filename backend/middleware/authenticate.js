'use strict';
 
const { verifyAccessToken } = require('../utils/jwt');
const { sendError }         = require('../utils/response');
 
/**
 * authenticate
 * Validates the Bearer token in the Authorization header.
 * On success, attaches the decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access token required', 401);
  }
 
  const token = authHeader.split(' ')[1];
 
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;   // { user_id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    return sendError(res, 'Invalid token', 401);
  }
};
 
module.exports = authenticate;