import { Router } from 'express';
import multer from 'multer';
import { analyzeContractController } from '../controllers/contract.controller.js';

// Store files in memory — no disk writes needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(_req, file, cb) {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (!allowed.includes(file.mimetype)) {
      const err = new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT document.');
      err.status = 415;
      return cb(err);
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/analyze', upload.single('document'), analyzeContractController);

export default router;
