const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

router.post('/', async (req, res) => {
    const { query, type } = req.body;

    // Basic Validation - In production, this needs AST parsing or strict allowlisting
    if (!query) {
        return res.status(400).send('Query is required');
    }

    // Very basic SQL injection prevention for this "Vibe coding" prototype
    // In a real app, we would use strict parameterized queries or a builder.
    // However, the requirement asks for dynamic query execution from a builder.
    // We will trust the query constructed by the frontend builder for now, 
    // but ensure it's a SELECT statement.
    const upperQuery = query.trim().toUpperCase();
    if (!upperQuery.startsWith('SELECT')) {
        return res.status(400).send('Only SELECT queries are allowed.');
    }

    try {
        const pool = await getPool();
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Query execution error:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
