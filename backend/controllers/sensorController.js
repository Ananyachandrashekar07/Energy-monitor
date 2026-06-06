'use strict';

const db = require('../config/db');


// ── GET ALL SENSORS ─────────────────────────────────────

const getAll = (req, res) => {

    db.query(
        `SELECT s.*, z.name AS zone_name
         FROM sensors s
         JOIN zones z
         ON s.zone_id = z.zone_id
         ORDER BY s.sensor_id DESC`,

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


// ── GET SENSOR BY ID ────────────────────────────────────

const getById = (req, res) => {

    db.query(
        'SELECT * FROM sensors WHERE sensor_id = ?',

        [req.params.id],

        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Sensor not found'
                });
            }

            res.json({
                success: true,
                data: results[0]
            });

        }
    );

};


// ── CREATE SENSOR ───────────────────────────────────────

const create = (req, res) => {

    const {
        zone_id,
        serial_number,
        sensor_type,
        unit,
        manufacturer,
        model_number
    } = req.body;

    db.query(
        `INSERT INTO sensors
        (zone_id, serial_number, sensor_type, unit, manufacturer, model_number)
        VALUES (?, ?, ?, ?, ?, ?)`,

        [
            zone_id,
            serial_number,
            sensor_type,
            unit,
            manufacturer,
            model_number
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
                message: 'Sensor created'
            });

        }
    );

};


// ── UPDATE SENSOR ───────────────────────────────────────

const update = (req, res) => {

    const {
        serial_number,
        sensor_type,
        unit,
        manufacturer,
        model_number,
        zone_id
    } = req.body;

    db.query(
        `UPDATE sensors
         SET serial_number = ?,
             sensor_type = ?,
             unit = ?,
             manufacturer = ?,
             model_number = ?,
             zone_id = ?
         WHERE sensor_id = ?`,

        [
            serial_number,
            sensor_type,
            unit,
            manufacturer,
            model_number,
            zone_id,
            req.params.id
        ],

        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: 'Sensor updated'
            });

        }
    );

};


// ── TOGGLE SENSOR ACTIVE ────────────────────────────────

const toggleActive = (req, res) => {

    db.query(
        'SELECT is_active FROM sensors WHERE sensor_id = ?',

        [req.params.id],

        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Sensor not found'
                });
            }

            const newStatus = results[0].is_active ? 0 : 1;

            db.query(
                'UPDATE sensors SET is_active = ? WHERE sensor_id = ?',

                [newStatus, req.params.id],

                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Sensor status updated'
                    });

                }
            );

        }
    );

};


// ── DELETE SENSOR ───────────────────────────────────────

const remove = (req, res) => {

    db.query(
        'DELETE FROM sensors WHERE sensor_id = ?',

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
                message: 'Sensor deleted'
            });

        }
    );

};


module.exports = {
    getAll,
    getById,
    create,
    update,
    toggleActive,
    remove
};