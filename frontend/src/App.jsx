import { useContext, useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import ApplyJobs from './pages/ApplyJobs'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import toast, { Toaster } from 'react-hot-toast';
import CandidateLogin from './components/CandidateLogin'



function App() {
  const {showRecruiterLogin, showCandidateLogin, companyToken} = useContext(AppContext)

  return (
    <div>
      <Toaster />
      {showRecruiterLogin && <RecruiterLogin />}
      {showCandidateLogin && <CandidateLogin />}  
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/apply-job/:id' element={<ApplyJobs />} />
      <Route path='/applications' element={<Applications />} />
      <Route path='/dashboard' element={<Dashboard />}>
      {
        companyToken ? <>
        <Route path='add-job' element={<AddJob />} />
        <Route path='manage-jobs' element={<ManageJobs />} />
        <Route path='view-applications' element={<ViewApplications />} /> 
        </>
        : null
      }
      </Route>
    </Routes>
    
    </div>
  )
}

export default App
