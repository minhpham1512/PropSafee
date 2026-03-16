// ===== MongoDB Connection =====
const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGO_URI;
    
    if (!uri || uri.includes('YOUR_USERNAME')) {
        console.warn('⚠️  MONGO_URI not configured in .env');
        console.warn('   Get your free MongoDB Atlas URI at: https://cloud.mongodb.com');
        console.warn('   Then update backend/.env with your connection string\n');
        console.warn('   Running without database — using in-memory data only.\n');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
    }
}

module.exports = connectDB;
