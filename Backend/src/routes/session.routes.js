import { Router } from 'express';
import { getSession, deleteSession } from '../controllers/session.controller.js';

const router = Router();

router.get('/:id', getSession);
router.delete('/:id', deleteSession);

export default router;
