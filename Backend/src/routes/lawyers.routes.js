import { Router } from 'express';
import { searchLawyers, getStates, getDistricts } from '../controllers/lawyers.controller.js';

const router = Router();

router.get('/',          searchLawyers);
router.get('/states',    getStates);
router.get('/districts', getDistricts);

export default router;
