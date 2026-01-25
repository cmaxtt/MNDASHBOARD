const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { updateConfig, sql } = require('../db');

// Path to .env file
const envPath = path.join(__dirname, '../.env');

// Helper to update .env file
const updateEnvFile = (newSettings) => {
    if (!fs.existsSync(envPath)) return;

    let envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    const updates = {
        DB_USER: newSettings.user,
        DB_PASSWORD: newSettings.password,
        DB_SERVER: newSettings.server,
        DB_DATABASE: newSettings.database
    };

    const newLines = lines.map(line => {
        const [key] = line.split('=');
        if (updates[key] !== undefined) {
            return `${key}=${updates[key]}`;
        }
        return line;
    });

    // Add missing keys
    Object.keys(updates).forEach(key => {
        if (!newLines.some(line => line.startsWith(`${key}=`))) {
            newLines.push(`${key}=${updates[key]}`);
        }
    });

    fs.writeFileSync(envPath, newLines.join('\n'));
};

// GET current settings (stripped of password)
router.get('/current', async (req, res) => {
    try {
        res.json({
            user: process.env.DB_USER,
            server: process.env.DB_SERVER,
            database: process.env.DB_DATABASE
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST validate credentials
router.post('/validate', async (req, res) => {
    const { user, password, server, database } = req.body;

    const config = {
        user,
        password,
        server,
        database,
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    };

    try {
        const pool = new sql.ConnectionPool(config);
        await pool.connect();
        await pool.close();
        res.json({ success: true, message: 'Connection successful!' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// POST save and update config
router.post('/save', async (req, res) => {
    const { user, password, server, database } = req.body;

    try {
        // 1. Update .env file for persistence
        updateEnvFile({ user, password, server, database });

        // 2. Refresh process.env for current session
        process.env.DB_USER = user;
        process.env.DB_PASSWORD = password;
        process.env.DB_SERVER = server;
        process.env.DB_DATABASE = database;

        // 3. Re-initialize DB connection pool
        await updateConfig({ user, password, server, database });

        res.json({ success: true, message: 'Settings saved and connection updated!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
