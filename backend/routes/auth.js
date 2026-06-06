'use strict';

const router = require('express').Router();

const { body } = require('express-validator');

const ctrl = require('../controllers/authController');

const validate = require('../middleware/validate');


// ── Validation Rules ─────────────────────────────────────

const registerRules = [

  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name required'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

];

const loginRules = [

  body('email')
    .isEmail()
    .normalizeEmail(),

  body('password')
    .notEmpty(),

];


// ── Routes ───────────────────────────────────────────────

router.post(
  '/register',
  registerRules,
  validate,
  ctrl.register
);

router.post(
  '/login',
  loginRules,
  validate,
  ctrl.login
);


module.exports = router;