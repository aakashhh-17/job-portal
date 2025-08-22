import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom"

const JobCard = ({job}) => {
  const navigate = useNavigate();

  return (
    <div className='p-6 flex flex-col shadow bg-white rounded '>
        <img className='size-8 mb-2' src={job.companyId.image} alt="" />
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