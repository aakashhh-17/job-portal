import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { BriefcaseBusiness, MapPin, User, Wallet } from "lucide-react";
import digitsToK from "../utils/digitsToK";
import moment from 'moment'
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";

const ApplyJobs = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const { jobs } = useContext(AppContext);

  const fetchJob = async () => {
    const currJob = await jobs.find((job) => job._id === id);
    setJobData(currJob);
  };

  useEffect(() => {
    fetchJob();
    console.log(jobData);
  }, [id, jobs]);


  return jobData ? (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className=" px-15 py-20 flex items-center flex-col sm:flex-row justify-between bg-blue-50/90 border border-blue-200 rounded-lg gap-5 flex-wrap">
            <div className="flex max-sm:flex-col max-sm:items-center max-sm:text-center gap-5 flex-wrap">
              <img
                className="size-20 p-3 border bg-white border-gray-300 rounded max-sm:mx-auto"
                src={jobData.companyId.image}
                alt=""
              />
              <div className="flex flex-col justify-between py-1 flex-wrap max-sm:items-center">
                <h1 className="text-3xl font-medium">{jobData.title}</h1>
                <div className="flex gap-4 flex-wrap max-sm:justify-center">
                  <span className="flex gap-1 text-gray-500 items-center">
                    <BriefcaseBusiness className="size-5" />
                    <p>{jobData.companyId.name}</p>
                  </span>
                  <span className="flex gap-1 text-gray-500 items-center">
                    <MapPin className="size-5" />
                    <p>{jobData.location}</p>
                  </span>
                  <span className="flex gap-1 text-gray-500 items-center">
                    <User className="size-5" />
                    <p>{jobData.level}</p>
                  </span>
                  <span className="flex gap-1 text-gray-500 items-center">
                    <Wallet className="size-5" />
                    <p>{digitsToK(jobData.salary)}</p>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col ">
              <button className=" px-10 py-2 bg-blue-600 text-white text-sm rounded ">
                Apply Now
              </button>
              <p className="mt-1 text-gray-600 text-sm">Posted {moment(jobData.date).fromNow()}</p>
            </div>
          </div>

          <div className="flex mt-8 flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3 ">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{__html:jobData.description}}></div>
              <button className=" px-10 py-2 bg-blue-600 text-white text-sm rounded mt-10 ">
                Apply Now
              </button>
            </div>

            {/* Right section more jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5 ">
              <h2>More jobs from {jobData.companyId.name}</h2>
               {jobs.filter((job) => job._id !== jobData._id && job.companyId._id === jobData.companyId._id).filter(job => true).slice(0,4).map((job, index)=>(
                <JobCard key={index} job={job} />
               ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJobs;
