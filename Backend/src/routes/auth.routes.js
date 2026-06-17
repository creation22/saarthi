import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  registerController,
  loginController,
  getMeController,
  updateMeController,
} from '../controllers/auth.controller.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  message: { error: 'Too many attempts. Please wait 15 minutes.' },
});

router.post('/register', authLimiter, registerController);
router.post('/login',    authLimiter, loginController);
router.get('/me',        requireAuth, getMeController);
router.patch('/me',      requireAuth, updateMeController);

export default router;
