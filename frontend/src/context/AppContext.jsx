import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// REMOVED: import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showCandidateLogin, setShowCandidateLogin] = useState(false); // NEW

  const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") || null);
  const [companyData, setCompanyData] = useState(null);

  // NEW: candidate token stored like companyToken
  const [candidateToken, setCandidateToken] = useState(localStorage.getItem("candidateToken") || null);
  const [userData, setUserData] = useState(null); // null instead of []
  const [userApplications, setUserApplications] = useState([]);

  // NEW: call these from CandidateLogin on success
  const candidateLogin = (token, user) => {
    localStorage.setItem("candidateToken", token);
    setCandidateToken(token);
    setUserData(user);
  };

  const candidateLogout = () => {
    localStorage.removeItem("candidateToken");
    setCandidateToken(null);
    setUserData(null);
    setUserApplications([]);
  };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");
      // REMOVED: token header — job listing is public, no auth needed
      if (data.success) {
        setJobs(data.jobs);
      } else {
        console.log("Error in fetching jobs");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: { token: companyToken }, // company keeps its header format
      });
      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    if (!candidateToken) return; // CHANGED: guard instead of getToken()
    try {
      const { data } = await axios.get(backendUrl + "/api/users/user", {
        headers: { Authorization: `Bearer ${candidateToken}` }, // CHANGED
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserApplications = async () => {
    if (!candidateToken) return; // CHANGED: guard instead of getToken()
    try {
      const { data } = await axios.get(backendUrl + "/api/users/applications", {
        headers: { Authorization: `Bearer ${candidateToken}` }, // CHANGED
      });
      if (data.success) {
        setUserApplications(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) setCompanyToken(storedCompanyToken);

    // NEW: restore candidate session on page refresh
    const storedCandidateToken = localStorage.getItem("candidateToken");
    if (storedCandidateToken) setCandidateToken(storedCandidateToken);
  }, []);

  useEffect(() => {
    if (companyToken) fetchCompanyData();
  }, [companyToken]);

  // CHANGED: trigger on candidateToken instead of Clerk's user object
  useEffect(() => {
    if (candidateToken) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [candidateToken]);

  const value = {
    searchFilter, setSearchFilter,
    isSearched, setIsSearched,
    jobs, setJobs,
    showRecruiterLogin, setShowRecruiterLogin,
    showCandidateLogin, setShowCandidateLogin, // NEW
    companyToken, setCompanyToken,
    companyData, setCompanyData,
    backendUrl,
    candidateToken,         // NEW: exposed so components can use it
    candidateLogin,         // NEW: call on login/register success
    candidateLogout,        // NEW: call on logout
    userData, setUserData,
    userApplications, setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};