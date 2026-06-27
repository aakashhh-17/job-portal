import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { BriefcaseBusiness, MapPin, User, Wallet } from "lucide-react";
import digitsToK from "../utils/digitsToK";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
// import { useAuth } from "@clerk/clerk-react";

const ApplyJobs = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [isMatchExpanded, setIsMatchExpanded] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchCache, setMatchCache] = useState({});

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications,
    candidateToken,
  } = useContext(AppContext);
  const navigate = useNavigate();

  // const { getToken } = useAuth();

  const checkMatch = async () => {
    if (matchCache[id]) {
      setIsMatchExpanded(true);
      return;
    }

    setLoadingMatch(true);
    try {
      // const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/ai/match-resume",
        { jobId: id },
        { headers: { Authorization: `Bearer ${candidateToken}` } },
      );
      if (data.success) {
        setMatchCache((prev) => ({
          ...prev,
          [id]: data,
        }));
        setIsMatchExpanded(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setLoadingMatch(false);
  };

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.jobData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error("Login to apply for job");
      }
      if (!userData.resume) {
        navigate("/applications");
        return toast.error("Upload your resume first");
      }

      // const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/users/apply",
        { jobId: id },
        { headers: { Authorization: `Bearer ${candidateToken}` } },
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some((item) => item.jobId._id == id);
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    fetchJob();
    console.log(userApplications);
  }, [id, jobs]);

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkAlreadyApplied();
    }
  }, [jobData, userApplications, id]);

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

            <div className="flex flex-col gap-3">
              <button
                onClick={applyHandler}
                className={` px-10 py-2 ${isAlreadyApplied ? "bg-blue-300 text-black" : "bg-blue-600 text-white"}  text-sm rounded `}
              >
                {isAlreadyApplied ? "Already applied" : "Apply now"}
              </button>
              <button
                onClick={checkMatch}
                disabled={!userData?.resume || loadingMatch}
                title={
                  !userData?.resume
                    ? "Upload your resume to check match score"
                    : ""
                }
                className={`px-10 py-2 text-sm rounded ${
                  !userData?.resume || loadingMatch
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {loadingMatch ? "Checking..." : "Check Resume Match"}
              </button>
              <p className="mt-1 text-gray-600 text-sm">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {isMatchExpanded && matchCache[id] && (
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                Resume Match Results
                <button
                  onClick={() => setIsMatchExpanded(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </h3>

              <div className="mb-6">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`text-5xl font-bold ${
                        matchCache[id].score >= 70
                          ? "text-green-600"
                          : matchCache[id].score >= 40
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {matchCache[id].score}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Match Score
                    </div>
                  </div>
                  <div
                    className={`flex-1 h-3 rounded-full ${
                      matchCache[id].score >= 70
                        ? "bg-green-100"
                        : matchCache[id].score >= 40
                          ? "bg-yellow-100"
                          : "bg-red-100"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        matchCache[id].score >= 70
                          ? "bg-green-600"
                          : matchCache[id].score >= 40
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }`}
                      style={{ width: `${matchCache[id].score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Matched Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchCache[id].matchedSkills &&
                  matchCache[id].matchedSkills.length > 0 ? (
                    matchCache[id].matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No matched skills</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchCache[id].missingSkills &&
                  matchCache[id].missingSkills.length > 0 ? (
                    matchCache[id].missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">All skills matched!</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {matchCache[id].summary}
                </p>
              </div>
            </div>
          )}

          <div className="flex mt-8 flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3 ">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>
              <button
                onClick={applyHandler}
                className={` px-10 py-2 ${isAlreadyApplied ? "bg-blue-300 text-black" : "bg-blue-600 text-white"}  text-sm rounded `}
              >
                {isAlreadyApplied ? "Already applied" : "Apply now"}
              </button>
            </div>

            {/* Right section more jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5 ">
              <h2>More jobs from {jobData.companyId.name}</h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId._id === jobData.companyId._id,
                )
                .filter((job) => {
                  const appliedJobIds = new Set(
                    userApplications.map((app) => app.jobId && app.jobId._id),
                  );

                  return !appliedJobIds.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => (
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
