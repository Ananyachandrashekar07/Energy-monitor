'use strict';

const express = require('express');

const router = express.Router();

const { body } = require('express-validator');

const ctrl = require('../controllers/userController');

const authenticate = require('../middleware/authenticate');

const authorize = require('../middleware/authorize');

const validate = require('../middleware/validate');

// Validation rules
const createRules = [
    body('full_name').trim().notEmpty(),

    body('email').isEmail().normalizeEmail(),

    body('password').isLength({ min: 8 }),

    body('role').optional().isIn(['admin', 'manager', 'viewer']),
];

const updateRules = [
    body('role').optional().isIn(['admin', 'manager', 'viewer']),

    body('is_active').optional().isBoolean(),
];

// Routes

router.get(
    '/',
    authenticate,
    authorize('admin'),
    ctrl.getAll
);

router.get(
    '/:id',
    authenticate,
    ctrl.getById
);

router.post(
    '/',
    authenticate,
    authorize('admin'),
    createRules,
    validate,
    ctrl.create
);

router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    updateRules,
    validate,
    ctrl.update
);

router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    ctrl.remove
);

module.exports = router;