'use strict';

const router = require('express').Router();

const { body } = require('express-validator');

const ctrl = require('../controllers/floorController');

const authenticate = require('../middleware/authenticate');

const authorize = require('../middleware/authorize');

const validate = require('../middleware/validate');


const auth = [authenticate];

const managers = [authenticate, authorize('admin', 'manager')];

const admins = [authenticate, authorize('admin')];


const floorRules = [

  body('building_id')
    .isInt({ min: 1 })
    .withMessage('building_id required'),

  body('floor_number')
    .isInt()
    .withMessage('floor_number required'),

  body('label')
    .trim()
    .notEmpty()
    .withMessage('label required'),

  body('area_sqm')
    .optional()
    .isDecimal(),

];


router.get('/', ...auth, ctrl.getAll);

router.get('/:id', ...auth, ctrl.getById);

router.post('/', ...managers, floorRules, validate, ctrl.create);

router.put('/:id', ...managers, validate, ctrl.update);

router.delete('/:id', ...admins, ctrl.remove);


module.exports = router;