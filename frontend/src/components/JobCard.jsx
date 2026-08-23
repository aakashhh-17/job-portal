import { HeartIcon, Building2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { backendUrl, userData, candidateToken } = useContext(AppContext);
  const [bookmark, setBookmark] = useState(false);

  const isExternal = job.source === "adzuna";
  const companyName = job.companyId?.name || job.companyName || "Company";
  const companyLogo = job.companyId?.image || job.companyLogo;

  const handleBookmark = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/users/bookmark",
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${candidateToken}` } },
      );

      if (data.success) {
        toast.success(data.message);
        if (data.bookmarked == true) setBookmark(true);
        if (data.bookmarked == false) setBookmark(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userData?.bookmarkedJobs?.map(id => id.toString()).includes(job._id.toString())) {
      setBookmark(true);
    } else {
      setBookmark(false);
    }
  }, [userData, job._id]);

  return (
    <div className="p-6 flex flex-col shadow bg-white rounded ">
      <div className="flex flex-row justify-between">
        {companyLogo ? (
          <img className="size-8 mb-2" src={companyLogo} alt="" />
        ) : (
          <div className="size-8 mb-2 rounded bg-gray-100 flex items-center justify-center">
            <Building2 className="size-4 text-gray-400" />
          </div>
        )}
        <HeartIcon
          onClick={() => handleBookmark()}
          className={
            bookmark
              ? "fill-red-500 border-none size-5 text-gray-500 mb-2 cursor-pointer"
              : `size-5 text-gray-500 mb-2 cursor-pointer`
          }
        />
      </div>
      <p className="font-semibold text-lg mb-1">{job.title}</p>
      <p className="text-sm text-gray-500 mb-3">{companyName}</p>
      <div className="flex gap-3 text-xs font-medium mb-3 flex-wrap">
        <span className=" text-md bg-blue-50 border text-gray-700 border-blue-200 px-3 py-1.5 rounded">
          {job.location}
        </span>
        <span className=" text-md bg-red-50 border text-gray-700 border-red-200 px-3 py-1.5 rounded">
          {job.level}
        </span>
        {isExternal && (
          <span className="flex items-center gap-1 text-md bg-amber-50 border text-amber-700 border-amber-200 px-3 py-1.5 rounded">
            <ExternalLink className="size-3" /> External
          </span>
        )}
      </div>
      <p
        className="text-sm text-gray-500 mb-3"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
      ></p>
      <div>
        {isExternal ? (
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block py-2 px-3 rounded bg-blue-600 text-white text-sm cursor-pointer"
          >
            Apply now
          </a>
        ) : (
          <button
            onClick={() => {
              navigate(`/apply-job/${job._id}`);
              scrollTo(0, 0);
            }}
            className="py-2 px-3 rounded bg-blue-600 text-white text-sm cursor-pointer"
          >
            Apply now
          </button>
        )}

        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="border border-gray-500 py-2 px-3 rounded text-gray-500 text-sm ml-3  cursor-pointer"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;