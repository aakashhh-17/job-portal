import Company from "../models/Company.js";
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import generateToken from "../utils/generateToken.js";

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile)
    return res
      .status(400)
      .json({ success: false, message: "Something is missing" });

    try {
        const companyExists = await Company.findOne({email});

        if(companyExists){
            res.status(400).json({success: false, message: "Company already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        
        
        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        });

        res.status(201).json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

    } catch (error) {
        res.status(500).json({success: false, message: `Error in registerCompany controller:  ${error.message}`})
    }
};

export const loginCompany = async (req, res) => {};

export const getCompanyData = async (req, res) => {};

export const postjob = async (req, res) => {};

export const getCompanyJobApplicants = async (req, res) => {};

export const getCompanyPostedJobs = async (req, res) => {};

export const changeJobApplicationStatus = async (req, res) => {};

export const changeVisibility = async (req, res) => {};
