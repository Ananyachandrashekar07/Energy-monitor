'use strict';

const bcrypt = require('bcryptjs');

const db = require('../config/db');

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt');

const {
  sendSuccess,
  sendError
} = require('../utils/response');

const logger = require('../utils/logger');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;


// ── REGISTER ─────────────────────────────────────────────

const register = async (req, res, next) => {

  try {

    const {
      full_name,
      email,
      password,
      role = 'admin'
    } = req.body;

    const assignedRole = 'admin';


    db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email],

      async (err, existing) => {

        if (err) {
          return next(err);
        }

        if (existing.length > 0) {
          return sendError(res, 'Email already registered', 409);
        }

        const password_hash = await bcrypt.hash(password, ROUNDS);

        db.query(
          'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
          [full_name, email, password_hash, assignedRole],

          (err, result) => {

            if (err) {
              return next(err);
            }

            const user = {
              user_id: result.insertId,
              full_name,
              email,
              role: assignedRole
            };

            const accessToken = signAccessToken(user);

            const refreshToken = signRefreshToken({
              user_id: user.user_id
            });

            logger.info(`New user registered: ${email}`);

            return sendSuccess(
              res,
              { user, accessToken, refreshToken },
              'Registration successful',
              201
            );

          }
        );

      }
    );

  } catch (err) {

    next(err);

  }

};


// ── LOGIN ────────────────────────────────────────────────

const login = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    db.query(
      `SELECT user_id,
              full_name,
              email,
              password_hash,
              role,
              is_active
       FROM users
       WHERE email = ?`,
      [email],

      async (err, rows) => {

        if (err) {
          return next(err);
        }

        if (rows.length === 0) {
          return sendError(res, 'Invalid email or password', 401);
        }

        const user = rows[0];

        if (!user.is_active) {
          return sendError(res, 'Account deactivated', 403);
        }

        const isMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!isMatch) {
          return sendError(res, 'Invalid email or password', 401);
        }

        const payload = {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        };

        const accessToken = signAccessToken(payload);

        const refreshToken = signRefreshToken({
          user_id: user.user_id
        });

        delete user.password_hash;

        logger.info(`User logged in: ${email}`);

        return sendSuccess(
          res,
          { user, accessToken, refreshToken },
          'Login successful'
        );

      }
    );

  } catch (err) {

    next(err);

  }

};


module.exports = {
  register,
  login
};