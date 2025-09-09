import React, { useContext, useEffect, useState } from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(false);
  const { companyToken, backendUrl } = useContext(AppContext);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });
      if (data.success) {
        setJobs(data.jobsData.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onVisibilityChangeHandler = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visibility",
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        data.message && toast.success(data.message);
        fetchJobs();
      } else {
        data.message && toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [companyToken]);

  return jobs ? (
    jobs.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        {" "}
        <p className="text-xl sm:text-2xl"> No jobs available</p>
      </div>
    ) : (
      <div className="container p-4 max-w-5xl">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left border-b border-gray-200 max-sm:hidden">
                  #
                </th>
                <th className="py-2 px-4 text-left border-b border-gray-200">
                  Job Title
                </th>
                <th className="py-2 px-4 text-left border-b border-gray-200 max-sm:hidden">
                  Date
                </th>
                <th className="py-2 px-4 text-left border-b border-gray-200 max-sm:hidden">
                  Location
                </th>
                <th className="py-2 px-4 text-center border-b border-gray-200">
                  Applicants
                </th>
                <th className="py-2 px-4 text-left border-b border-gray-200">
                  Visible
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {job.title}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                    {job.location}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {job.applicants}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      onChange={() => onVisibilityChangeHandler(job._id)}
                      className="scale-125 ml-4"
                      type="checkbox"
                      checked={job.visible}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate("/dashboard/add-job")}
            className="bg-black text-white py-2 px-4 rounded"
          >
            Add new job
          </button>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;
