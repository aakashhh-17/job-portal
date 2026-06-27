// backend/routes/aiRoutes.js
import express from 'express';
import { matchResumeToJob } from '../controllers/aiController.js';
import { protectCandidate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/match-resume', protectCandidate, matchResumeToJob);

export default router;