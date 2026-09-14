import dns from 'node:dns';
import mongoose from 'mongoose';

// Use system DNS (works with Atlas SRV on most networks).
// NOTE: don't force dns.setServers(['8.8.8.8', ...]) — direct UDP to
// public DNS is blocked on some networks and breaks SRV lookup with ECONNREFUSED.
try {
  dns.setDefaultResultOrder('ipv4first');
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
