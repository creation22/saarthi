import { Router } from 'express';
import multer from 'multer';
import { textQueryController, voiceQueryController, speakController } from '../controllers/query.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/text',  optionalAuth, textQueryController);
router.post('/voice', optionalAuth, upload.single('audio'), voiceQueryController);
router.post('/speak', speakController);

export default router;
