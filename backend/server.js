// ===== PropSafe Backend - Server Entry Point =====
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const propertiesRouter = require('./routes/properties');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static('../'));

// API Routes
app.use('/api/properties', propertiesRouter);
app.use('/api/analyze', analyzeRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'PropSafe API',
        timestamp: new Date().toISOString(),
        agents: ['legal', 'market', 'environment', 'fraud', 'orchestrator']
    });
});

// Connect to DB and start server
async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`\n🛡️  PropSafe Backend running on http://localhost:${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}/api/properties`);
            console.log(`🤖 AI:  http://localhost:${PORT}/api/analyze/full`);
            console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
}

start();
