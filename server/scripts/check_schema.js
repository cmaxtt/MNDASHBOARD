const { connectDB, getPool } = require('../db');

async function checkSchema() {
    try {
        await connectDB();
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'tblPurchases'
            ORDER BY COLUMN_NAME
        `);

        console.table(result.recordset);

    } catch (err) {
        console.error('Error querying schema:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
