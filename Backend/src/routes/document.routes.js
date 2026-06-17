import { Router } from 'express';
import { generateDocumentController } from '../controllers/document.controller.js';

const router = Router();

router.post('/generate', generateDocumentController);

export default router;
