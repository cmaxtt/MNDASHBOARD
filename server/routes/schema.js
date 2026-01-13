const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

router.get('/summary', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `
            SELECT 
                TABLE_NAME, 
                COLUMN_NAME, 
                DATA_TYPE 
            FROM 
                INFORMATION_SCHEMA.COLUMNS 
            WHERE 
                TABLE_NAME IN ('tblInvoices', 'tblInvoiceDetails', 'tblProducts')
        `;
        const result = await pool.request().query(query);

        // Transform to a friendlier format
        const schema = {};
        result.recordset.forEach(row => {
            if (!schema[row.TABLE_NAME]) {
                schema[row.TABLE_NAME] = [];
            }
            schema[row.TABLE_NAME].push({
                name: row.COLUMN_NAME,
                type: row.DATA_TYPE
            });
        });

        res.json(schema);
    } catch (err) {
        console.error('Schema fetch error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
