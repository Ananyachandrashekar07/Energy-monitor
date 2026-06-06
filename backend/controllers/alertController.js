'use strict';

const db = require('../config/db');


// ── GET ALERT RULES ─────────────────────────────────────

const getRules = (req, res) => {

    db.query(
        'SELECT * FROM threshold_rules',

        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                data: results
            });

        }
    );

};


// ── CREATE ALERT RULE ───────────────────────────────────

const createRule = (req, res) => {

    const {
        building_id,
        zone_id,
        metric_type,
        threshold_value,
        condition_op,
        window_minutes
    } = req.body;

    db.query(
        `INSERT INTO threshold_rules
        (building_id, zone_id, metric_type, threshold_value, condition_op, window_minutes)
        VALUES (?, ?, ?, ?, ?, ?)`,

        [
            building_id,
            zone_id,
            metric_type,
            threshold_value,
            condition_op,
            window_minutes
        ],

        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: 'Alert rule created'
            });

        }
    );

};


// ── UPDATE ALERT RULE ───────────────────────────────────

const updateRule = (req, res) => {

    const { threshold_value } = req.body;

    db.query(
        'UPDATE threshold_rules SET threshold_value = ? WHERE rule_id = ?',

        [threshold_value, req.params.id],

        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: 'Alert rule updated'
            });

        }
    );

};


// ── DELETE ALERT RULE ───────────────────────────────────

const deleteRule = (req, res) => {

    db.query(
        'DELETE FROM threshold_rules WHERE rule_id = ?',

        [req.params.id],

        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: 'Alert rule deleted'
            });

        }
    );

};


// ── GET ALERT LOGS ──────────────────────────────────────

const getLogs = (req, res) => {

    db.query(
        'SELECT * FROM alert_logs',

        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                data: results
            });

        }
    );

};


// ── UPDATE ALERT STATUS ─────────────────────────────────

const updateLogStatus = (req, res) => {

    const { status } = req.body;

    db.query(
        'UPDATE alert_logs SET status = ? WHERE alert_id = ?',

        [status, req.params.id],

        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: 'Alert status updated'
            });

        }
    );

};


module.exports = {
    getRules,
    createRule,
    updateRule,
    deleteRule,
    getLogs,
    updateLogStatus
};