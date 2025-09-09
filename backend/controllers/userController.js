import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";
import User from "../models/User.js";
import {v2 as cloudinary} from 'cloudinary'

export const getUserData = async (req, res) => {
  const userId = req.auth.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "No user found!" });
    res.json({ success: true, user });
  } catch (error) {
    res.json({
      success: false,
      message: `Error in getUserData controller: ${error.message}`,
    });
  }
};

export const applyForJob = async (req, res) => {
    const {jobId} = req.body;
    const userId = req.auth.userId;
    try {
        const isAlreadyApplied = await JobApplication.find({jobId, userId});
        if(isAlreadyApplied.length > 0){
          return res.json({success: false, message: 'Already applied'});
        }

        const jobData = await Job.findById(jobId);
        if(!jobData) return res.json({success: false, message: 'Job not found'});

        const newJob = await JobApplication.create({
          userId,
          companyId: jobData.companyId,
          jobId,
          date: Date.now(),
        });

        res.status(201).json({success: true, message: 'Applied successfully', data: newJob});
    } catch (error) {
      res.status(201).json({success: false, message: `Error in applyForJob: ${error.message}`});
    }

};

export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const applications = await JobApplication.find({userId}).populate('companyId', 'name email image').
    populate('jobId', 'title description location salary category level').exec();

    if(!applications) return res.status(404).json({success: false, message: 'No job applications found'});

    return res.json({success: true, applications});
  } catch (error) {
    res.status(201).json({success: false, message: `Error in getUserJobApplications: ${error.message}`});
  }
};

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;
    const userData = await User.findById(userId);

    if(!resumeFile) return res.json({success: false, message: 'No resume found'});

    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
    userData.resume = resumeUpload.secure_url;

    await userData.save();

    return res.json({success: true, message: 'Resume updated'});
  } catch (error) {
    res.json({success: false, message: `Error in updateUserResume: ${error.message}`});
  }
};
