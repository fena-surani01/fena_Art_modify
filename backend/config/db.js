const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS blocking SRV records (ECONNREFUSED querySrv)
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
    // Retain system DNS if custom servers cannot be set
}

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fenaria';
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // Fast fail in 5s instead of hanging for 30s
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
        return true;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.warn(`💡 If you are using MongoDB Atlas, make sure your IP is whitelisted (0.0.0.0/0) in Atlas > Network Access.`);
        return false;
    }
};

module.exports = connectDB;

