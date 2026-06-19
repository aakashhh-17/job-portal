// backend/routes/aiRoutes.js
import express from 'express';
import { matchResumeToJob } from '../controllers/aiController.js';

const router = express.Router();
router.post('/match-resume', matchResumeToJob);
export default router;