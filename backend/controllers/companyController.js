import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile)
    return res.json({ success: false, message: "Something is missing" });

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.json({
        success: false,
        message: "Company already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });

    return res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in registerCompany controller:  ${error.message}`,
    });
  }
};

export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Something is missing" });

    const company = await Company.findOne({ email });
    const correctPass = await bcrypt.compare(password, company.password);
    if (correctPass) {
      res.status(200).json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in loginCompany controller: ${error}`,
    });
  }
};

export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;

    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const postjob = async (req, res) => {
  const { title, description, location, salary, category, level, visible } =
    req.body;
  if (!title || !description || !location || !salary)
    return res
      .status(400)
      .json({ success: false, message: "Something is missing" });

  const companyId = req.company._id;
  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      category,
      level,
      visible,
      date: Date.now(),
    });

    await newJob.save();

    res.status(201).json({ success: true, message: "New job created", newJob });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in postJob controller: ${error.message}`,
    });
  }
};

export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    const applicantsData = await JobApplication.find({ companyId })
      .populate("userId", "image name resume")
      .populate("jobId", "title location");

    return res.status(200).json({ success: true, applicantsData });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    // adding number of applicants info in data
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({
      success: false,
      message: `Error in getCompanyPostedJobs: ${error.message}`,
    });
  }
};

export const changeJobApplicationStatus = async (req, res) => {
  try {
    const companyId = req.company._id;
  const {applicationId, newStatus} = req.body;

  const jobApplicationData = await JobApplication.findById(applicationId);
  if(!jobApplicationData) return res.json({success:false, message: 'Job not found'});

  const newJobApplicationData = await JobApplication.findByIdAndUpdate(applicationId, {
    status: newStatus
  },{new: true});

  return res.json({success: true, newJobApplicationData, message: 'Status updated'});
  } catch (error) {
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }

    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    res.json(`Error in changeVisibility controller: ${error.message}`);
  }
};
