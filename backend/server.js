const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Essential for Render Free Tier Keep-Alive)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'Fenaria Art Studio Backend',
        timestamp: new Date().toISOString()
    });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} not found.`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Fenaria Backend running on port ${PORT} (Environment: ${process.env.NODE_ENV || 'development'})`);
});
