export const SAMPLE_QUERIES = [
    {
        id: 'daily_trends',
        title: 'Daily Sales Trend',
        sql: `SELECT CAST(InvoiceDate AS DATE) as Date, SUM(SaletotalVI) as TotalSales 
              FROM tblInvoices 
              GROUP BY CAST(InvoiceDate AS DATE) 
              ORDER BY Date DESC`
    },
    {
        id: 'top_salespeople',
        title: 'Top 5 Salespeople',
        sql: `SELECT TOP 5 SalespersonName, SUM(SaletotalVI) as TotalSales 
              FROM tblInvoices 
              GROUP BY SalespersonName 
              ORDER BY TotalSales DESC`
    },
    {
        id: 'stock_alert',
        title: 'Stock Alert (Low Inventory)',
        sql: `SELECT ProductName, QuantityOnHand, MinimumStock 
              FROM tblProducts 
              WHERE QuantityOnHand < MinimumStock`
    },
    {
        id: 'revenue_by_payment',
        title: 'Revenue by Payment Type',
        sql: `SELECT PaymentType, SUM(SaletotalVI) as TotalRevenue 
              FROM tblInvoices 
              GROUP BY PaymentType`
    },
    {
        id: 'recent_invoices',
        title: 'Recent Invoices',
        sql: `SELECT TOP 50 InvoiceNo, InvoiceDate, SalespersonName, SaletotalVI 
              FROM tblInvoices 
              ORDER BY InvoiceDate DESC`
    }
];
