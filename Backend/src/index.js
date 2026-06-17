import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Refresh stale eCourts case data every hour (cases older than 6 hours)
  setInterval(() => refreshStaleCases(6), 60 * 60 * 1000);
});
