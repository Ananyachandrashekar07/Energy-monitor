'use strict';
 
const cron               = require('node-cron');
const { aggregateDay }   = require('../services/aggregationService');
const logger             = require('../utils/logger');
 
// Run every day at 00:05 AM server time — just after midnight so all
// of the previous day's readings are guaranteed to be committed.
cron.schedule('5 0 * * *', async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = yesterday.toISOString().slice(0, 10);
 
  logger.info(`[CRON] Starting daily aggregation job for ${date}`);
  try {
    const count = await aggregateDay(date);
    logger.info(`[CRON] Aggregation done — ${count} sensors processed for ${date}`);
  } catch (err) {
    logger.error(`[CRON] Aggregation failed for ${date}: ${err.message}`);
  }
}, { timezone: 'UTC' });
 
logger.info('[CRON] Daily aggregation job scheduled (00:05 UTC)');