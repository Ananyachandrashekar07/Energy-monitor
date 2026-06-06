'use strict';
 
const { query }                  = require('../config/db');
const logger                     = require('../utils/logger');
const notificationService        = require('./notificationService');
 
/**
 * evaluate(sensor_id, value)
 *
 * Called after every new energy reading.
 * 1. Fetches all active threshold rules applicable to this sensor's zone / building.
 * 2. Applies the condition operator to the raw reading value.
 * 3. Inserts an alert_log row if the condition is breached.
 * 4. Triggers email notification asynchronously.
 */
const evaluate = async (sensor_id, value) => {
  try {
    // Fetch the sensor's zone and building so we can match rules at both levels
    const [sensorRows] = await query(
      `SELECT s.sensor_type, z.zone_id, b.building_id
       FROM sensors   s
       JOIN zones     z USING (zone_id)
       JOIN floors    f USING (floor_id)
       JOIN buildings b USING (building_id)
       WHERE s.sensor_id = ?`,
      [sensor_id],
    );
    if (sensorRows.length === 0) return;
    const { sensor_type, zone_id, building_id } = sensorRows[0];
 
    // Fetch matching active rules
    const [rules] = await query(
      `SELECT * FROM threshold_rules
       WHERE is_active = 1
         AND metric_type = ?
         AND (
               (zone_id IS NULL AND building_id = ?)   -- building-level rule
            OR (zone_id = ?)                            -- zone-level rule
            OR (zone_id IS NULL AND building_id IS NULL) -- global rule
         )`,
      [sensor_type, building_id, zone_id],
    );
 
    for (const rule of rules) {
      if (isBreached(rule.condition_op, value, rule.threshold_value)) {
        const severity = getSeverity(value, rule.threshold_value);
 
        const [result] = await query(
          `INSERT INTO alert_logs (rule_id, sensor_id, reading_value, severity, status, message)
           VALUES (?, ?, ?, ?, 'open', ?)`,
          [
            rule.rule_id,
            sensor_id,
            value,
            severity,
            `Sensor ${sensor_id} reading ${value} ${rule.condition_op} threshold ${rule.threshold_value}`,
          ],
        );
 
        logger.warn(
          `Alert #${result.insertId} fired — sensor ${sensor_id}, value ${value}, rule ${rule.rule_id}`,
        );
 
        // Send notifications without blocking
        notificationService.sendAlertEmail(result.insertId).catch(() => {});
      }
    }
  } catch (err) {
    logger.error(`Alert engine error for sensor ${sensor_id}: ${err.message}`);
  }
};
 
/**
 * Check whether a condition is breached.
 */
const isBreached = (op, actual, threshold) => {
  switch (op) {
    case 'gt':  return actual >  threshold;
    case 'gte': return actual >= threshold;
    case 'lt':  return actual <  threshold;
    case 'lte': return actual <= threshold;
    default:    return false;
  }
};
 
/**
 * Derive severity from how far the value exceeds the threshold.
 */
const getSeverity = (value, threshold) => {
  const ratio = threshold > 0 ? value / threshold : 1;
  if (ratio >= 2.0) return 'critical';
  if (ratio >= 1.5) return 'high';
  if (ratio >= 1.2) return 'medium';
  return 'low';
};
 
module.exports = { evaluate };