'use strict';

const db = require('../config/db');


// ── GET ALL FLOORS ──────────────────────────────────────

const getAll = (req, res) => {

    const { building_id } = req.query;

    let sql = `
        SELECT f.*, b.name AS building_name
        FROM floors f
        JOIN buildings b
        ON f.building_id = b.building_id
    `;

    const params = [];

    if (building_id) {
        sql += ' WHERE f.building_id = ?';
        params.push(building_id);
    }

    sql += ' ORDER BY f.floor_number';

    db.query(
        sql,
        params,

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


// ── GET FLOOR BY ID ─────────────────────────────────────

const getById = (req, res) => {

    db.query(
        `SELECT f.*, b.name AS building_name
         FROM floors f
         JOIN buildings b
         ON f.building_id = b.building_id
         WHERE f.floor_id = ?`,

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
                    message: 'Floor not found'
                });
            }

            res.json({
                success: true,
                data: results[0]
            });

        }
    );

};


// ── CREATE FLOOR ────────────────────────────────────────

const create = (req, res) => {

    const {
        building_id,
        floor_number,
        label,
        area_sqm
    } = req.body;

    db.query(
        `INSERT INTO floors
        (building_id, floor_number, label, area_sqm)
        VALUES (?, ?, ?, ?)`,

        [
            building_id,
            floor_number,
            label,
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
                message: 'Floor created'
            });

        }
    );

};


// ── UPDATE FLOOR ────────────────────────────────────────

const update = (req, res) => {

    const {
        floor_number,
        label,
        area_sqm
    } = req.body;

    db.query(
        `UPDATE floors
         SET floor_number = ?,
             label = ?,
             area_sqm = ?
         WHERE floor_id = ?`,

        [
            floor_number,
            label,
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
                message: 'Floor updated'
            });

        }
    );

};


// ── DELETE FLOOR ────────────────────────────────────────

const remove = (req, res) => {

    db.query(
        'DELETE FROM floors WHERE floor_id = ?',

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
                message: 'Floor deleted'
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