import express from "express";
import { applyForJob, bookmarkJob, getBookmarkedJobs, getUserData, getUserJobApplications, updateUserResume } from "../controllers/userController.js";
import upload from "../config/multer.js";
import { loginCandidate, registerCandidate } from "../controllers/userAuthController.js";
import { protectCandidate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.post('/register', upload.single('image'), registerCandidate);
router.post('/login', loginCandidate);

router.get('/user', protectCandidate, getUserData);
router.post('/apply', protectCandidate, applyForJob);
router.get('/applications', protectCandidate, getUserJobApplications)
router.post('/update-resume', protectCandidate, upload.single('resume'), updateUserResume)
router.post('/bookmark', protectCandidate, bookmarkJob);
router.get('/bookmarks', protectCandidate, getBookmarkedJobs);


export default router;