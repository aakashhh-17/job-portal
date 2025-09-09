import { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const ViewApplications = () => {
  const [applicants, setApplicants] = useState([]);
  const [applicantStatus, setApplicantStatus] = useState('Pending');
  const {backendUrl, companyToken} = useContext(AppContext);

  const fetchApplicants = async ()=>{
    try {
      const {data} = await axios.get(backendUrl+'/api/company/applicants', {headers: {token: companyToken}});
    if(data.success){
      setApplicants(data.applicantsData.reverse());
    }else{
      toast.error(data.message);
    }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleChangeStatus = async (applicationId, newStatus)=>{
    try {
      const {data} = await axios.post(backendUrl+'/api/company/change-status', {applicationId, newStatus}, {headers:{token: companyToken}});

      if(data.success){
        toast.success(data.message);
        fetchApplicants();
        setApplicantStatus(data.newJobApplicationData.status);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(companyToken){
      fetchApplicants();
    console.log(applicants.length > 0 && applicants);
    }
  },[companyToken,]);
  


  return applicants ? applicants.length === 0 ? (<div className="flex items-center justify-center h-[70vh]">
        {" "}
        <p className="text-xl sm:text-2xl"> No job applications available</p>
      </div>) : (
    <div className='container mx-auto p-4'>
      <div className=''>
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>Username</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index)=>(
              <tr key={index} className='text-gray-700 '>
                {/* <h1>{applicant._id}</h1> */}
                <td className='py-2 px-4 border-b border-gray-200 text-center'>{index+1}</td>
                <td className='py-2 px-4 border-b border-gray-200 text-center items-center flex '>
                  <img className='size-10 rounded-full mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                  <span>{applicant.userId.name}</span>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{applicant.jobId.title}</td>
                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{applicant.jobId.location}</td>
                <td className='py-2 px-4 border-b border-gray-200'>
                  <a href={applicant.userId.resume} target='_blank'
                  className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'
                  >
                    Resume <img src={applicant.userId.resume} alt="" />
                  </a>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 relative'>
                  <div className='relative inline-block text-left group'>
                    <button className={`${applicant.status === 'Accepted' ? 'text-green-500' : ''} ${applicant.status === 'Rejected' ? 'text-red-500' : ''} text-gray-500 action-button`}>{applicant.status !== 'Pending' && applicant.status}</button>
                    <div  className='z-10 absolute hidden right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                      <button onClick={()=>handleChangeStatus(applicant._id, 'Accepted')} className='block w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-100'>Accept</button>
                      <button onClick={()=>handleChangeStatus(applicant._id,'Rejected')} className='block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100'>Reject</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default ViewApplications