'use strict';
 
const router       = require('express').Router();
const { body }     = require('express-validator');
const ctrl         = require('../controllers/zoneController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const validate     = require('../middleware/validate');
 
const auth     = [authenticate];
const managers = [authenticate, authorize('admin','manager')];
const admins   = [authenticate, authorize('admin')];
 
const zoneRules = [
  body('floor_id').isInt({ min: 1 }).withMessage('floor_id required'),
  body('name').trim().notEmpty().withMessage('name required'),
  body('zone_type').trim().notEmpty().withMessage('zone_type required'),
];
 
router.get('/',        ...auth,                         ctrl.getAll);
router.get('/:id',     ...auth,                         ctrl.getById);
router.post('/',       ...managers, zoneRules, validate, ctrl.create);
router.put('/:id',     ...managers,            validate, ctrl.update);
router.delete('/:id',  ...admins,                        ctrl.remove);
 
module.exports = router;