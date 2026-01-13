const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

let poolPromise;

const connectDB = async () => {
    try {
        if (!poolPromise) {
            poolPromise = new sql.ConnectionPool(config).connect();
            await poolPromise;
            console.log('Connected to MSSQL Database');
        }
        return poolPromise;
    } catch (err) {
        console.error('Database Connection Failed! Bad Config: ', err);
    }
};

const getPool = () => {
    if (poolPromise) return poolPromise;
    throw new Error('Database connection not initialized');
}

module.exports = {
    connectDB,
    getPool,
    sql
};
