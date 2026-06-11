import { HeartIcon, Link } from "lucide-react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const JobCard = ({job}) => {
  const navigate = useNavigate();
  const {getToken} = useAuth();
  const {backendUrl, userData} = useContext(AppContext); 
  const [bookmark, setBookmark] = useState(false);

  const handleBookmark = async () =>{
    const token = await getToken();

    try{
      const {data} = await axios.post(backendUrl + "/api/users/bookmark", {jobId: job._id}, 
        {headers: {
          Authorization: `Bearer ${token}`
        }}
      );
      console.log(job._id);

      console.log("clicked bookmark", data);
      
      if(data.success ){
        toast.success("Bookmarked updated");
        console.log(data.message);
        if(data.bookmarked == true) setBookmark(true);
        if(data.bookmarked == false) setBookmark(false); 
      } 
    }catch(error){
      console.log(error.message);
    }
  }

  useEffect(()=>{
    console.log(userData);
    if(userData && userData?.bookmarkedJobs?.includes(job._id)){
      setBookmark(true);
    }else{
      setBookmark(false);
    }
  },[userData, job._id]);

  return (
    <div className='p-6 flex flex-col shadow bg-white rounded '>
        <div className="flex flex-row justify-between">
        <img className='size-8 mb-2' src={job.companyId.image} alt="" />
        <HeartIcon onClick={()=> handleBookmark()} className = { bookmark ? 'fill-red-500 border-none size-5 text-gray-500 mb-2 cursor-pointer'  :  `size-5 text-gray-500 mb-2 cursor-pointer`} />
      </div>
        <p className='font-semibold text-lg mb-3'>{job.title}</p>
        <div className='flex gap-3 text-xs font-medium mb-3 '>
            <span className=' text-md bg-blue-50 border text-gray-700 border-blue-200 px-3 py-1.5 rounded'>{job.location}</span>
            <span className=' text-md bg-red-50 border text-gray-700 border-red-200 px-3 py-1.5 rounded'>{job.level}</span>
        </div>
        <p className='text-sm text-gray-500 mb-3' dangerouslySetInnerHTML={{__html:job.description.slice(0,150)}}></p>
        <div>
          <button onClick={()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0);}} className='py-2 px-3 rounded bg-blue-600 text-white text-sm cursor-pointer'>Apply now</button>
          
          <button onClick={()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0);}} className='border border-gray-500 py-2 px-3 rounded text-gray-500 text-sm ml-3  cursor-pointer'>Learn more</button>
        </div>
    </div>
  )
}

export default JobCard