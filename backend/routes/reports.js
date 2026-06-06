'use strict';

const express = require('express');

const router = express.Router();

const ctrl = require('../controllers/reportController');

const authenticate = require('../middleware/authenticate');

// Authentication middleware array
const auth = [authenticate];

// Routes
router.get('/consumption', auth, ctrl.getConsumption);

router.get('/trends', auth, ctrl.getTrends);

router.get('/top-consumers', auth, ctrl.getTopConsumers);

router.get('/dashboard-summary', auth, ctrl.getDashboardSummary);

module.exports = router;