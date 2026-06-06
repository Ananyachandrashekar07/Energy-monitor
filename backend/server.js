'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const db = require('./config/db');

const logger = require('./utils/logger');

const errorHandler = require('./middleware/errorHandler');

const notFound = require('./middleware/notFound');


// ── Routes ─────────────────────────────────────────────────────────────

const authRoutes = require('./routes/auth');

const buildingRoutes = require('./routes/buildings');

const floorRoutes = require('./routes/floors');

const zoneRoutes = require('./routes/zones');

const sensorRoutes = require('./routes/sensors');

const readingRoutes = require('./routes/readings');

const alertRoutes = require('./routes/alerts');

const reportRoutes = require('./routes/reports');

const userRoutes = require('./routes/users');

// ── Cron jobs ──────────────────────────────────────────────────────────

require('./jobs/dataRollupJob');


const app = express();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;


// ── Security & utility middleware ─────────────────────────────────────

app.use(helmet());

app.use(compression());

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


// ── Rate limiting ─────────────────────────────────────────────────────

const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,

    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
});

app.use('/api/', limiter);


// ── Body parsing ──────────────────────────────────────────────────────

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({
    extended: true,
    limit: '1mb'
}));


// ── HTTP request logging ──────────────────────────────────────────────

app.use(morgan('combined', {
    stream: {
        write: (msg) => logger.http(msg.trim())
    },
}));


// ── Health check ──────────────────────────────────────────────────────

app.get('/health', (_req, res) => {

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });

});


// ── API routes ────────────────────────────────────────────────────────

const API = '/api/v1';

app.use(`${API}/auth`, authRoutes);

app.use(`${API}/users`, userRoutes);

app.use(`${API}/buildings`, buildingRoutes);

app.use(`${API}/floors`, floorRoutes);

app.use(`${API}/zones`, zoneRoutes);

app.use(`${API}/sensors`, sensorRoutes);

app.use(`${API}/readings`, readingRoutes);

app.use(`${API}/alerts`, alertRoutes);

app.use(`${API}/reports`, reportRoutes);


// ── 404 & global error handler ───────────────────────────────────────

app.use(notFound);

app.use(errorHandler);


// ── Start Server ─────────────────────────────────────────────────────

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});


module.exports = app;