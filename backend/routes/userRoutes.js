import express from "express";
import { applyForJob, bookmarkJob, getBookmarkedJobs, getUserData, getUserJobApplications, updateUserResume } from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get('/user', getUserData);
router.post('/apply', applyForJob);
router.get('/applications', getUserJobApplications)
router.post('/update-resume', upload.single('resume'), updateUserResume)
router.post('/bookmark', bookmarkJob);
router.get('/bookmarks', getBookmarkedJobs);


export default router;