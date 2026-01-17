const { connectDB, getPool } = require('../db');

async function readSP() {
    try {
        await connectDB();
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT OBJECT_DEFINITION(OBJECT_ID('dbo.usp_GetPurchaseSummaryByProductAndDate')) AS SP_Definition;
        `);

        console.log(result.recordset[0].SP_Definition);

    } catch (err) {
        console.error('Error reading SP:', err);
    } finally {
        process.exit();
    }
}

readSP();
