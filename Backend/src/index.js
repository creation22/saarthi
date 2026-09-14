import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import queryRoutes    from './routes/query.routes.js';
import documentRoutes from './routes/document.routes.js';
import contractRoutes from './routes/contract.routes.js';
import sessionRoutes  from './routes/session.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import authRoutes     from './routes/auth.routes.js';
import trackerRoutes  from './routes/tracker.routes.js';
import matterRoutes   from './routes/matter.routes.js';
import lawyersRoutes  from './routes/lawyers.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { refreshStaleCases } from './services/ecourts.service.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Add it to Backend/.env (see .env.example).');
  process.exit(1);
}

const app = express();

// Support a comma-separated allowlist, e.g. FRONTEND_URL="https://app.example.com,http://localhost:5173"
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // Allow same-origin / non-browser clients with no Origin header
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origin not allowed'));
  },
}));
// Cap JSON/body size — large payloads go through multer (voice/contract), not JSON
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Throttle the expensive AI endpoints (per IP). Auth routes have their own stricter limiter.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a few minutes.' },
});
app.use('/api/query', aiLimiter);
app.use('/api/contract', aiLimiter);
app.use('/api/document', aiLimiter);
app.use('/api/matters', aiLimiter);

app.use('/api/query',    queryRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/session',  sessionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/tracker',  trackerRoutes);
app.use('/api/matters',  matterRoutes);
app.use('/api/lawyers',  lawyersRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Unknown routes → JSON 404 (must sit after routes, before the error handler)
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Refresh stale eCourts case data every hour (cases older than 6 hours).
  // Guarded so a DB/network failure never raises an unhandled rejection,
  // and overlapping runs can't pile up.
  let refreshing = false;
  setInterval(() => {
    if (refreshing) return;
    refreshing = true;
    refreshStaleCases(6)
      .catch((err) => console.error('Background case refresh failed:', err.message))
      .finally(() => { refreshing = false; });
  }, 60 * 60 * 1000);
});
