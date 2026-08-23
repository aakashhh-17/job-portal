import express from 'express';
import { syncAdzunaJobs } from '../controllers/jobSyncController.js';

const router = express.Router();

const verifyCronSecret = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

router.post('/sync-jobs', verifyCronSecret, syncAdzunaJobs);

export default router;