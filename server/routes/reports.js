const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

router.get('/fast-sellers', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).send('startDate and endDate are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).send('Invalid date format');
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('StartDate', sql.DateTime, start)
            .input('EndDate', sql.DateTime, end)
            .execute('usp_GetFastSellersReport');

        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching fast sellers report:', err);
        res.status(500).send(err.message);
    }
});

router.get('/purchase-summary', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).send('startDate and endDate are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).send('Invalid date format');
    }

    try {
        const pool = await getPool();

        // 1. Get the report data from the stored procedure
        const reportResult = await pool.request()
            .input('StartDate', sql.DateTime, start)
            .input('EndDate', sql.DateTime, end)
            .execute('usp_GetPurchaseSummaryByProductAndDate');

        const reportData = reportResult.recordset;
        console.log('Report Row Sample:', reportData[0]); // Debugging structure

        // 2. If we have data, we need to fetch the product names
        if (reportData.length > 0) {
            // Get all product codes from the result
            const productCodes = [...new Set(reportData.map(item => item.ProductCode))].filter(code => code);

            if (productCodes.length > 0) {
                // Fetch product details for these codes
                // Note: Using a simple IN clause. For very large lists, a temp table or chunking might be needed,
                // but for a summary report this is usually fine.
                const codesList = productCodes.map(code => `'${String(code).replace(/'/g, "''")}'`).join(',');
                const productsQuery = `SELECT ProductCode, ProductName FROM tblProducts WHERE ProductCode IN (${codesList})`;

                const productsResult = await pool.request().query(productsQuery);
                const productsMap = {};
                productsResult.recordset.forEach(p => {
                    productsMap[p.ProductCode] = p.ProductName;
                });

                // 3. Merge the name back into the report data
                reportData.forEach(row => {
                    row.ProductName = productsMap[row.ProductCode] || 'Unknown Product';
                });
            }
        }

        res.json(reportData);
    } catch (err) {
        console.error('Error fetching purchase summary report:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
