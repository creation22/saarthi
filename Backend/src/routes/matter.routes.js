import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  listMatters,
  createMatter,
  getMatter,
  updateMatter,
  deleteMatter,
  linkSession,
  linkCase,
  generateMatterDocument,
} from '../controllers/matter.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/',                        listMatters);
router.post('/',                       createMatter);
router.get('/:id',                     getMatter);
router.patch('/:id',                   updateMatter);
router.delete('/:id',                  deleteMatter);
router.post('/:id/sessions',           linkSession);
router.post('/:id/cases',              linkCase);
router.post('/:id/documents',          generateMatterDocument);

export default router;
