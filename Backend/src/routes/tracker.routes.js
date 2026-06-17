import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  addTrackedCase,
  getTrackedCases,
  getCaseDetail,
  refreshCase,
  untrackCase,
} from '../controllers/tracker.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/',             addTrackedCase);
router.get('/',              getTrackedCases);
router.get('/:cnr',          getCaseDetail);
router.post('/:cnr/refresh', refreshCase);
router.delete('/:cnr',       untrackCase);

export default router;
