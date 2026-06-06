'use strict';
 
const nodemailer = require('nodemailer');
const { query }  = require('../config/db');
const logger     = require('../utils/logger');
 
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
 
/**
 * sendAlertEmail(alert_id)
 * Fetches alert details and emails all admin/manager users.
 */
const sendAlertEmail = async (alert_id) => {
  try {
    const [rows] = await query(
      `SELECT al.*, r.metric_type, r.threshold_value, r.condition_op,
              s.serial_number, s.unit, z.name AS zone_name, b.name AS building_name
       FROM alert_logs al
       JOIN threshold_rules r  ON r.rule_id    = al.rule_id
       JOIN sensors         s  ON s.sensor_id  = al.sensor_id
       JOIN zones           z  ON z.zone_id    = s.zone_id
       JOIN floors          f  ON f.floor_id   = z.floor_id
       JOIN buildings       b  ON b.building_id = f.building_id
       WHERE al.alert_id = ?`,
      [alert_id],
    );
    if (rows.length === 0) return;
    const alert = rows[0];
 
    // Fetch recipients: admins and managers
    const [users] = await query(
      "SELECT email, full_name FROM users WHERE role IN ('admin','manager') AND is_active = 1",
    );
    if (users.length === 0) return;
 
    const recipients = users.map(u => u.email).join(', ');
    const subject    = `[${alert.severity.toUpperCase()}] Energy alert — ${alert.building_name}`;
    const html = `
      <h2 style="color:#c0392b;">⚡ Energy Alert — ${alert.severity.toUpperCase()}</h2>
      <table border="1" cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><th>Building</th><td>${alert.building_name}</td></tr>
        <tr><th>Zone</th><td>${alert.zone_name}</td></tr>
        <tr><th>Sensor</th><td>${alert.serial_number}</td></tr>
        <tr><th>Metric</th><td>${alert.metric_type}</td></tr>
        <tr><th>Reading</th><td>${alert.reading_value} ${alert.unit}</td></tr>
        <tr><th>Threshold</th><td>${alert.condition_op} ${alert.threshold_value} ${alert.unit}</td></tr>
        <tr><th>Time</th><td>${alert.triggered_at}</td></tr>
        <tr><th>Message</th><td>${alert.message}</td></tr>
      </table>
      <p style="color:#888;font-size:12px;">Energy Usage Monitoring System</p>
    `;
 
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || 'noreply@energymonitor.com',
      to:      recipients,
      subject,
      html,
    });
 
    logger.info(`Alert email sent for alert #${alert_id} to ${recipients}`);
  } catch (err) {
    logger.error(`Email notification failed for alert #${alert_id}: ${err.message}`);
  }
};
 
module.exports = { sendAlertEmail };