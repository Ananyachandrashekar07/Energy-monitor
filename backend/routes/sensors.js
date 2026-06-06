'use strict';
 
const router       = require('express').Router();
const { body }     = require('express-validator');
const ctrl         = require('../controllers/sensorController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const validate     = require('../middleware/validate');
 
const auth     = [authenticate];
const managers = [authenticate, authorize('admin','manager')];
const admins   = [authenticate, authorize('admin')];
 
const sensorTypes = ['electricity','water','gas','hvac','solar'];
 
const sensorRules = [
  body('zone_id').isInt({ min: 1 }).withMessage('zone_id required'),
  body('serial_number').trim().notEmpty().withMessage('serial_number required'),
  body('sensor_type').isIn(sensorTypes).withMessage(`sensor_type must be one of: ${sensorTypes.join(', ')}`),
  body('unit').trim().notEmpty().withMessage('unit required'),
];
 
router.get('/',              ...auth,                          ctrl.getAll);
router.get('/:id',           ...auth,                          ctrl.getById);
router.post('/',             ...managers, sensorRules, validate, ctrl.create);
router.put('/:id',           ...managers,              validate, ctrl.update);
router.patch('/:id/toggle',  ...managers,                       ctrl.toggleActive);
router.delete('/:id',        ...admins,                         ctrl.remove);
 
module.exports = router;