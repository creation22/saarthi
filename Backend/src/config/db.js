import dns from 'node:dns';
import mongoose from 'mongoose';

// Configure DNS resolution for MongoDB Atlas SRV lookup on Windows/restricted networks
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback if custom DNS setting is not permitted in environment
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saarthi';

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Please make sure MongoDB Atlas IP access list or MONGODB_URI in Backend/.env is valid');
    process.exit(1);
  }
}
