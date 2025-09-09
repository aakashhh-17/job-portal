import Job from "../models/Job.js"

export const getAllJobs = async(req, res)=>{
try {
    const jobs = await Job.find({visible: true}).populate({path: 'companyId', select: '-password'});

    res.json({success: true, jobs})

} catch (error) {
    res.status(500).json({success: false, message:`Error in getAllJobs controller:  ${error.message}`});
}
}

export const getJobById = async(req, res)=>{
    const {id} = req.params;
    try {
     const jobData = await Job.findById(id).populate({path: 'companyId', select: '-password'});
     
     if(!jobData){
        return res.json({success: false, message: 'Job not found!'});
     }else{
        return res.json({success: true, jobData})
     }
    } catch (error) {
        return res.status(500).json({success: false, message:`Error in getJobById controller:  ${error.message}`});
    }
}