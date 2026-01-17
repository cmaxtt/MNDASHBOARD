const { connectDB, getPool } = require('../db');

async function createStoredProcedure() {
    try {
        await connectDB();
        const pool = await getPool();

        const createProcedureQuery = `
            CREATE OR ALTER PROCEDURE [dbo].[usp_GetFastSellersReport]
                @StartDate DATETIME,
                @EndDate DATETIME
            AS
            BEGIN
                SET NOCOUNT ON;

                SELECT 
                    v.VendorName, 
                    SUM(pd.Quantity) as TotalQuantity, 
                    SUM(pd.PricePerUnit * pd.Quantity) as TotalPurchaseValue
                FROM 
                    tblPurchases p
                INNER JOIN 
                    tblPurchaseDetails pd ON p.PInvoiceID = pd.pInvoiceID
                INNER JOIN 
                    tblVendors v ON p.VendorID = v.VendorID
                WHERE 
                    p.pInvoiceDate >= @StartDate 
                    AND p.pInvoiceDate < DATEADD(DAY, 1, @EndDate)
                GROUP BY 
                    v.VendorName
                ORDER BY 
                    TotalPurchaseValue DESC;
            END
        `;

        await pool.request().query(createProcedureQuery);
        console.log('Stored Procedure usp_GetFastSellersReport created successfully.');
    } catch (err) {
        console.error('Error creating stored procedure:', err);
    } finally {
        process.exit();
    }
}

createStoredProcedure();
