'use strict';

const db = require('../config/db');


// ── GET ALL ZONES ───────────────────────────────────────

const getAll = (req, res) => {

    db.query(

        `SELECT

            z.zone_id,
            z.name,
            z.zone_type,
            z.area_sqm,

            f.floor_id,
            f.label AS floor_label,

            b.building_id,
            b.name AS building_name

        FROM zones z

        LEFT JOIN floors f
        ON z.floor_id = f.floor_id

        LEFT JOIN buildings b
        ON f.building_id = b.building_id

        ORDER BY z.zone_id ASC`,

        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            console.log(results);

            res.json({
                success: true,
                data: results
            });

        }

    );

};


// ── GET ZONE BY ID ──────────────────────────────────────

const getById = (req, res) => {

    db.query(
        'SELECT * FROM zones WHERE zone_id = ?',

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
                    message: 'Zone not found'
                });
            }

            res.json({
                success: true,
                data: results[0]
            });

        }
    );

};


// ── CREATE ZONE ─────────────────────────────────────────

const create = (req, res) => {

    const {
        floor_id,
        name,
        zone_type,
        area_sqm
    } = req.body;

    db.query(
        `INSERT INTO zones
        (floor_id, name, zone_type, area_sqm)
        VALUES (?, ?, ?, ?)`,

        [
            floor_id,
            name,
            zone_type,
            area_sqm
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
                message: 'Zone created'
            });

        }
    );

};


// ── UPDATE ZONE ─────────────────────────────────────────

const update = (req, res) => {

    const {
        name,
        zone_type,
        area_sqm
    } = req.body;

    db.query(
        `UPDATE zones
         SET name = ?,
             zone_type = ?,
             area_sqm = ?
         WHERE zone_id = ?`,

        [
            name,
            zone_type,
            area_sqm,
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
                message: 'Zone updated'
            });

        }
    );

};


// ── DELETE ZONE ─────────────────────────────────────────

const remove = (req, res) => {

    db.query(
        'DELETE FROM zones WHERE zone_id = ?',

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
                message: 'Zone deleted'
            });

        }
    );

};


module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};