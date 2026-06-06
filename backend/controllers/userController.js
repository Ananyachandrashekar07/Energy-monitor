'use strict';

const bcrypt = require('bcryptjs');

const db = require('../config/db');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;


// ── GET ALL USERS ───────────────────────────────────────

const getAll = (req, res) => {

    db.query(
        `SELECT
            user_id,
            full_name,
            email,
            role,
            is_active,
            created_at
         FROM users
         ORDER BY created_at DESC`,

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


// ── GET USER BY ID ──────────────────────────────────────

const getById = (req, res) => {

    db.query(
        `SELECT
            user_id,
            full_name,
            email,
            role,
            is_active,
            created_at
         FROM users
         WHERE user_id = ?`,

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
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: results[0]
            });

        }
    );

};


// ── CREATE USER ─────────────────────────────────────────

const create = async (req, res) => {

    try {

        const {
            full_name,
            email,
            password,
            role
        } = req.body;

        const password_hash = await bcrypt.hash(password, ROUNDS);

        db.query(
            `INSERT INTO users
            (full_name, email, password_hash, role)
            VALUES (?, ?, ?, ?)`,

            [
                full_name,
                email,
                password_hash,
                role || 'viewer'
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
                    message: 'User created'
                });

            }
        );

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// ── UPDATE USER ─────────────────────────────────────────

const update = (req, res) => {

    const {
        full_name,
        role,
        is_active
    } = req.body;

    db.query(
        `UPDATE users
         SET full_name = ?,
             role = ?,
             is_active = ?
         WHERE user_id = ?`,

        [
            full_name,
            role,
            is_active,
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
                message: 'User updated'
            });

        }
    );

};


// ── DELETE USER ─────────────────────────────────────────

const remove = (req, res) => {

    db.query(
        'DELETE FROM users WHERE user_id = ?',

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
                message: 'User deleted'
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