import express from 'express'
import { changeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postjob, registerCompany } from '../controllers/companyController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/register', upload.single('image') ,  registerCompany);
router.post('/login', loginCompany);
router.get('/company', getCompanyData);
router.post('/post-job', postjob);
router.get('/applicants', getCompanyJobApplicants);
router.get('/list-jobs', getCompanyPostedJobs);
router.post('/change-status', changeJobApplicationStatus);
router.post('/change-visibility', changeVisibility);

export default router;