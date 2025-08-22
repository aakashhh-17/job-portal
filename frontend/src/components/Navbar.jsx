import { useClerk, UserButton, useUser } from "@clerk/clerk-react"
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const {openSignIn} = useClerk();

  const {user} = useUser();
  const navigate = useNavigate();

  const {setShowRecruiterLogin} = useContext(AppContext);


  return (
    <div className='shadow py-4 '>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center '>
      <p onClick={()=> navigate('/')} className='text-3xl cursor-pointer'><span className='font-bold'>Career</span>Bridge</p>

      {user ? (
        <div className="flex items-center gap-2">
          <Link to={'/applications'}>Applied jobs</Link>
          <p>|</p>
          <p className="max-sm:hidden">Hi, {user.firstName + " " + user.lastName}</p>
          <UserButton />
        </div>
      ) : (
        <div className='flex gap-4 max-sm:text-xs items-center'>
        <button onClick={(e)=> setShowRecruiterLogin(true)} className='text-gray-600 cursor-pointer'>Recruiter Login</button>
        <button onClick={ e => openSignIn()} className='px-6 py-2 sm:px-9 bg-blue-600 text-white rounded-full cursor-pointer'>Login</button>
      </div>
      )}

      </div>
    </div>
  )
}

export default Navbar