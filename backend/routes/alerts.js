'use strict';
 
const router       = require('express').Router();
const { body }     = require('express-validator');
const ctrl         = require('../controllers/alertController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const validate     = require('../middleware/validate');
 
const auth     = [authenticate];
const managers = [authenticate, authorize('admin','manager')];
const admins   = [authenticate, authorize('admin')];
 
const metricTypes    = ['electricity','water','gas','hvac','solar'];
const conditionOps   = ['gt','gte','lt','lte'];
 
const ruleRules = [
  body('metric_type').isIn(metricTypes).withMessage(`metric_type must be one of: ${metricTypes.join(', ')}`),
  body('threshold_value').isDecimal().withMessage('threshold_value must be a number'),
  body('condition_op').optional().isIn(conditionOps),
  body('window_minutes').optional().isInt({ min: 1 }),
  body('building_id').optional().isInt({ min: 1 }),
  body('zone_id').optional().isInt({ min: 1 }),
];
 
// Threshold rule endpoints
router.get('/rules',          ...auth,                         ctrl.getRules);
router.post('/rules',         ...managers, ruleRules, validate, ctrl.createRule);
router.put('/rules/:id',      ...managers,             validate, ctrl.updateRule);
router.delete('/rules/:id',   ...admins,                        ctrl.deleteRule);
 
// Alert log endpoints
router.get('/logs',           ...auth,                         ctrl.getLogs);
router.patch('/logs/:id/status', ...managers,
  [body('status').isIn(['open','acknowledged','resolved'])],
  validate,
  ctrl.updateLogStatus,
);
 
module.exports = router;