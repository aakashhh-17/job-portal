import Job from '../models/Job.js';
import User from '../models/User.js';
import { extractResumeText } from '../utils/extractResumeText.js';
import { generateMatchScore } from '../services/aiService.js';

export const matchResumeToJob = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { jobId } = req.body;

    const [user, job] = await Promise.all([
      User.findById(userId),
      Job.findById(jobId),
    ]);

    if (!user?.resume) return res.json({ success: false, message: 'Upload a resume first' });
    if (!job) return res.json({ success: false, message: 'Job not found' });

    const resumeText = await extractResumeText(user.resume);
    const plainDescription = job.description.replace(/<[^>]+>/g, ' ');

    const result = await generateMatchScore(resumeText, plainDescription);

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error in matchResumeToJob: ${error.message}` });
  }
};