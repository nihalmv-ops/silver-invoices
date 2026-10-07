const dns = require('dns');
const mongoose = require('mongoose');

// Use Google Public DNS to avoid Windows ISP SRV ECONNREFUSED issues
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if custom dns cannot be set
}

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set in environment variables.');
    console.warn('👉 Please set MONGODB_URI in your .env or Render dashboard to enable database storage.');
    return false;
  }

  if (uri.includes('<') || uri.includes('>')) {
    console.warn('⚠️  WARNING: Your MONGODB_URI contains "<" or ">" brackets!');
    console.warn('👉 Remove the angle brackets from your username and password.');
    console.warn('   Example: mongodb+srv://nihalmv86_db_use:yourpassword@cluster0.xxx.mongodb.net/...');
  }

  if (uri.includes('cluster0.abcde.mongodb.net')) {
    console.warn('⚠️  WARNING: "cluster0.abcde.mongodb.net" is just an example placeholder!');
    console.warn('👉 Copy your real cluster address from MongoDB Atlas (e.g. cluster0.xxxxx.mongodb.net).');
  }

  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;

