'use strict';
 
const jwt = require('jsonwebtoken');
 
const SECRET         = process.env.JWT_SECRET;
const EXPIRES_IN     = process.env.JWT_EXPIRES_IN         || '24h';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_EXP    = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
 
if (!SECRET || !REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in .env');
}
 
/**
 * Generate an access token containing the user's id, email, and role.
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
 
/**
 * Generate a long-lived refresh token.
 */
const signRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
 
/**
 * Verify and decode an access token.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 */
const verifyAccessToken = (token) =>
  jwt.verify(token, SECRET);
 
/**
 * Verify and decode a refresh token.
 */
const verifyRefreshToken = (token) =>
  jwt.verify(token, REFRESH_SECRET);
 
module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };