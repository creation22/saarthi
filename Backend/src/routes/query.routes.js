import { Router } from 'express';
import multer from 'multer';
import { textQueryController, voiceQueryController, speakController } from '../controllers/query.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    // Accept audio uploads; some browsers label recordings as video/webm —
    // allow those too and let the STT service validate the content.
    const ok = typeof file.mimetype === 'string' &&
      (/^audio\//.test(file.mimetype) || file.mimetype === 'video/webm');
    if (!ok) {
      const err = new Error('Unsupported audio type. Please upload an audio recording.');
      err.status = 415;
      return cb(err);
    }
    cb(null, true);
  },
});

router.post('/text',  optionalAuth, textQueryController);
router.post('/voice', optionalAuth, upload.single('audio'), voiceQueryController);
router.post('/speak', speakController);

export default router;
