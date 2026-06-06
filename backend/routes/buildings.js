'use strict';
 
const router       = require('express').Router();
const { body }     = require('express-validator');
const ctrl         = require('../controllers/buildingController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const validate     = require('../middleware/validate');
 
const auth      = [authenticate];
const managers  = [authenticate, authorize('admin', 'manager')];
const admins    = [authenticate, authorize('admin')];
 
const buildingRules = [
  body('name').trim().notEmpty().withMessage('name required'),
  body('address').trim().notEmpty().withMessage('address required'),
  body('city').trim().notEmpty().withMessage('city required'),
  body('total_floors').optional().isInt({ min: 1 }),
  body('area_sqm').optional().isDecimal(),
];
 
router.get('/',        ...auth,                              ctrl.getAll);
router.get('/:id',     ...auth,                              ctrl.getById);
router.post('/',       ...managers, buildingRules, validate, ctrl.create);
router.put('/:id',     ...managers, buildingRules, validate, ctrl.update);
router.delete('/:id',  ...admins,                            ctrl.remove);
 
module.exports = router;