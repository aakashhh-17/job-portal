import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CandidateLogin = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const navigate = useNavigate();
  const { setShowCandidateLogin, backendUrl, candidateLogin } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // On signup, first screen collects name/email/password
    // second screen collects profile image
    if (state === "Sign Up" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/users/login", {
          email,
          password,
        });

        if (data.success) {
          candidateLogin(data.token, data.user); // sets state + localStorage
          setShowCandidateLogin(false);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        // Sign Up
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image); // optional profile pic

        const { data } = await axios.post(
          backendUrl + "/api/users/register",
          formData
        );

        if (data.success) {
          candidateLogin(data.token, data.user);
          setShowCandidateLogin(false);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Candidate {state}
        </h1>
        <p className="text-sm">
          {state === "Login"
            ? "Welcome back! Please sign in to continue"
            : "Create an account to start applying"}
        </p>

        {/* Sign Up step 2: profile image */}
        {state === "Sign Up" && isTextDataSubmitted ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image" className="cursor-pointer">
              <img
                className="w-16 rounded-full"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=""
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
            </label>
            <p>Upload profile <br /> picture (optional)</p>
          </div>
        ) : (
          <>
            {/* Name field — Sign Up only */}
            {state === "Sign Up" && (
              <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email address"
                required
              />
            </div>

            <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white w-full py-2 rounded-full"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "Next"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Sign Up");
                setIsTextDataSubmitted(false);
              }}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        {/* Close button */}
        <img
          onClick={() => setShowCandidateLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </form>
    </div>
  );
};

export default CandidateLogin;