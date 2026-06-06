'use strict';
 
const { query }  = require('../config/db');
const logger     = require('../utils/logger');
 
/**
 * aggregateDay(date)
 * Computes daily stats for all sensors for the given date (YYYY-MM-DD)
 * and upserts into daily_aggregates.
 */
const aggregateDay = async (date) => {
  logger.info(`Running daily aggregation for ${date}…`);
 
  const [sensors] = await query('SELECT sensor_id FROM sensors WHERE is_active = 1');
 
  let processed = 0;
  for (const { sensor_id } of sensors) {
    const [rows] = await query(
      `SELECT
         COUNT(*)        AS reading_count,
         COALESCE(SUM(value), 0)  AS total_consumption,
         COALESCE(AVG(value), 0)  AS avg_value,
         COALESCE(MAX(value), 0)  AS peak_value,
         COALESCE(MIN(value), 0)  AS min_value
       FROM energy_readings
       WHERE sensor_id = ? AND DATE(recorded_at) = ?`,
      [sensor_id, date],
    );
 
    const stat = rows[0];
    if (stat.reading_count === 0) continue;
 
    await query(
      `INSERT INTO daily_aggregates
         (sensor_id, agg_date, total_consumption, avg_value, peak_value, min_value, reading_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         total_consumption = VALUES(total_consumption),
         avg_value         = VALUES(avg_value),
         peak_value        = VALUES(peak_value),
         min_value         = VALUES(min_value),
         reading_count     = VALUES(reading_count)`,
      [sensor_id, date, stat.total_consumption, stat.avg_value,
       stat.peak_value, stat.min_value, stat.reading_count],
    );
    processed++;
  }
 
  logger.info(`Daily aggregation complete for ${date}: ${processed} sensors processed`);
  return processed;
};
 
/**
 * aggregateRange(fromDate, toDate)
 * Backfill aggregates for a date range. Useful for initial setup.
 */
const aggregateRange = async (fromDate, toDate) => {
  const from  = new Date(fromDate);
  const to    = new Date(toDate);
  const dates = [];
 
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
 
  for (const date of dates) {
    await aggregateDay(date);
  }
  logger.info(`Range aggregation done: ${dates.length} days`);
};
 
module.exports = { aggregateDay, aggregateRange };