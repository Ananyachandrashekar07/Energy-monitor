'use strict';

const db = require('../config/db');


// ── GET CONSUMPTION REPORT ──────────────────────────────

const getConsumption = (req, res) => {

    db.query(
        `SELECT
            s.sensor_type,
            SUM(r.value) AS total_consumption
         FROM energy_readings r
         JOIN sensors s
         ON r.sensor_id = s.sensor_id
         GROUP BY s.sensor_type`,

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


// ── GET TRENDS ──────────────────────────────────────────

const getTrends = (req, res) => {

    db.query(
        `SELECT
            DATE(recorded_at) AS day,
            SUM(value) AS total
         FROM energy_readings
         GROUP BY DATE(recorded_at)
         ORDER BY day ASC`,

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


// ── GET TOP CONSUMERS ───────────────────────────────────

const getTopConsumers = (req, res) => {

    db.query(
        `SELECT
            s.sensor_id,
            s.sensor_type,
            SUM(r.value) AS total_consumption
         FROM energy_readings r
         JOIN sensors s
         ON r.sensor_id = s.sensor_id
         GROUP BY s.sensor_id
         ORDER BY total_consumption DESC
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


// ── DASHBOARD SUMMARY ───────────────────────────────────

const getDashboardSummary = (req, res) => {

    db.query(
        'SELECT COUNT(*) AS total_buildings FROM buildings',

        (err, buildingResults) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            db.query(
                'SELECT COUNT(*) AS total_sensors FROM sensors',

                (err, sensorResults) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    db.query(
                        'SELECT COUNT(*) AS total_alerts FROM alert_logs',

                        (err, alertResults) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            db.query(
                                'SELECT SUM(value) AS total_energy FROM energy_readings',

                                (err, energyResults) => {

                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err.message
                                        });
                                    }

                                    res.json({
                                        success: true,
                                        data: {
                                            buildings: buildingResults[0].total_buildings,
                                            sensors: sensorResults[0].total_sensors,
                                            alerts: alertResults[0].total_alerts,
                                            total_energy: energyResults[0].total_energy || 0
                                        }
                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};


module.exports = {
    getConsumption,
    getTrends,
    getTopConsumers,
    getDashboardSummary
};