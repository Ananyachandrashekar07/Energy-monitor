'use strict';

const db = require('../config/db');


// ── GET ALL READINGS ────────────────────────────────────

const getAll = (req, res) => {

    db.query(
        `SELECT r.*, s.sensor_type
         FROM energy_readings r
         JOIN sensors s
         ON r.sensor_id = s.sensor_id
         ORDER BY r.recorded_at DESC`,

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


// ── GET LATEST READINGS ─────────────────────────────────

const getLatest = (req, res) => {

    db.query(
        `SELECT r.*, s.sensor_type
         FROM energy_readings r
         JOIN sensors s
         ON r.sensor_id = s.sensor_id
         ORDER BY r.recorded_at DESC
         LIMIT 10`,

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


// ── GET SUMMARY ─────────────────────────────────────────

const getSummary = (req, res) => {

    const { sensor_id } = req.query;

    db.query(
        `SELECT
            COUNT(*) AS total_readings,
            AVG(value) AS average_value,
            MAX(value) AS max_value,
            MIN(value) AS min_value
         FROM energy_readings
         WHERE sensor_id = ?`,

        [sensor_id],

        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                data: results[0]
            });

        }
    );

};


// ── CREATE READING ──────────────────────────────────────

const create = (req, res) => {

    const {
        sensor_id,
        value,
        recorded_at
    } = req.body;

    db.query(
        `INSERT INTO energy_readings
        (sensor_id, value, recorded_at)
        VALUES (?, ?, ?)`,

        [
            sensor_id,
            value,
            recorded_at
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
                message: 'Reading created'
            });

        }
    );

};


// ── BULK CREATE ─────────────────────────────────────────

const bulkCreate = (req, res) => {

    const { readings } = req.body;

    if (!Array.isArray(readings)) {
        return res.status(400).json({
            success: false,
            message: 'Readings array required'
        });
    }

    const values = readings.map(r => [
        r.sensor_id,
        r.value,
        r.recorded_at
    ]);

    db.query(
        `INSERT INTO energy_readings
        (sensor_id, value, recorded_at)
        VALUES ?`,

        [values],

        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: 'Bulk readings inserted'
            });

        }
    );

};


// ── DELETE READING ──────────────────────────────────────

const remove = (req, res) => {

    db.query(
        'DELETE FROM energy_readings WHERE reading_id = ?',

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
                message: 'Reading deleted'
            });

        }
    );

};


module.exports = {
    getAll,
    getLatest,
    getSummary,
    create,
    bulkCreate,
    remove
};