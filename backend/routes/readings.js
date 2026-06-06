'use strict';
 
const router       = require('express').Router();
const { body }     = require('express-validator');
const ctrl         = require('../controllers/readingController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');
const validate     = require('../middleware/validate');
 
const auth     = [authenticate];
const managers = [authenticate, authorize('admin','manager')];
const admins   = [authenticate, authorize('admin')];
 
const readingRules = [
  body('sensor_id').isInt({ min: 1 }).withMessage('sensor_id required'),
  body('value').isDecimal().withMessage('value must be a number'),
  body('recorded_at').optional().isISO8601().withMessage('recorded_at must be ISO 8601'),
];
 
router.get('/',           ...auth,                            ctrl.getAll);
router.get('/latest',     ...auth,                            ctrl.getLatest);
router.get('/summary',    ...auth,                            ctrl.getSummary);
router.post('/',          ...managers, readingRules, validate, ctrl.create);
router.post('/bulk',      ...managers,                         ctrl.bulkCreate);
router.delete('/:id',     ...admins,                           ctrl.remove);
 
module.exports = router;