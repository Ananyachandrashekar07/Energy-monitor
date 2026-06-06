'use strict';

const db = require('../config/db');


// ── GET ALL BUILDINGS ───────────────────────────────────

const getAll = (req, res) => {

    db.query(
        'SELECT * FROM buildings',

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


// ── GET BUILDING BY ID ──────────────────────────────────

const getById = (req, res) => {

    db.query(
        'SELECT * FROM buildings WHERE building_id = ?',

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
                    message: 'Building not found'
                });
            }

            res.json({
                success: true,
                data: results[0]
            });

        }
    );

};


// ── CREATE BUILDING ─────────────────────────────────────

const create = (req, res) => {

    const {
        name,
        address,
        city,
        country,
        total_floors,
        area_sqm
    } = req.body;

    db.query(
        `INSERT INTO buildings
        (name, address, city, country, total_floors, area_sqm)
        VALUES (?, ?, ?, ?, ?, ?)`,

        [
            name,
            address,
            city,
            country,
            total_floors,
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
                message: 'Building created'
            });

        }
    );

};


// ── UPDATE BUILDING ─────────────────────────────────────

const update = (req, res) => {

    const {
        name,
        address,
        city,
        country,
        total_floors,
        area_sqm
    } = req.body;

    db.query(
        `UPDATE buildings
        SET name = ?,
            address = ?,
            city = ?,
            country = ?,
            total_floors = ?,
            area_sqm = ?
        WHERE building_id = ?`,

        [
            name,
            address,
            city,
            country,
            total_floors,
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
                message: 'Building updated'
            });

        }
    );

};


// ── DELETE BUILDING ─────────────────────────────────────

const remove = (req, res) => {

    db.query(
        'DELETE FROM buildings WHERE building_id = ?',

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
                message: 'Building deleted'
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