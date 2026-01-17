const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./db');
const schemaRoutes = require('./routes/schema');
const executeRoutes = require('./routes/execute');
const reportsRoutes = require('./routes/reports');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/schema', schemaRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/reports', reportsRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('MEDBAG Dashboard API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Initialize DB connection pool
});
