import { useClerk, UserButton, useUser } from "@clerk/clerk-react"
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  // const {openSignIn} = useClerk();

  // const {user} = useUser();
  const navigate = useNavigate();

  const {setShowRecruiterLogin, userData, candidateLogout, setShowCandidateLogin} = useContext(AppContext);


  return (
    <div className='shadow py-4 '>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center '>
      <p onClick={()=> navigate('/')} className='text-3xl cursor-pointer'><span className='font-bold'>Career</span>Bridge</p>

      {userData ? (
  <div className="flex items-center gap-3">
    <Link to="/applications">Applied Jobs |</Link>
    <img
      className="w-8 rounded-full"
      src={userData.image || assets.upload_area}
      alt=""
    />
    <button
      onClick={candidateLogout}
      className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded-full"
    >
      Logout
    </button>
  </div>
) : (
  <div className="flex gap-4 max-sm:text-xs items-center">
    <button onClick={() => setShowRecruiterLogin(true)} className="text-gray-600">
      Recruiter Login |
    </button>
    <button
      onClick={() => setShowCandidateLogin(true)}  
      className="px-4 py-1 sm:px-9 bg-blue-600 text-white rounded-full"
    >
      Login
    </button>
  </div>
)}

      </div>
    </div>
  )
}

export default Navbar