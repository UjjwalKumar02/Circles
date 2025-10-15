import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiOpenSourceLine } from "react-icons/ri";
import { FaRegCopyright } from "react-icons/fa6";
import { PiLineVerticalLight } from "react-icons/pi";


const LandingPage = () => {
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };


  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${backendUrl}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          navigate("/home");
        } else {
          console.log("User not logged in");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    checkLogin();

  }, []);


  return (
    <div className="h-screen flex flex-col items-center bg-gray-50">

      <div className="w-full flex justify-between items-center md:px-11 px-5 py-6 ">
        <p className="text-2xl font-medium">
          Circles
        </p>
        <div className="flex items-center gap-6">
          <a href="" className="bg-black text-white px-5 py-1.5 rounded-full text-sm hover:bg-gray-800">Github</a>
        </div>
      </div>

      <div className="mx-auto h-full flex justify-center gap-10 pt-25 md:px-0 px-4">

        <div className="flex flex-col items-center text-center gap-6 pt-5 md:max-w-[70%]">

          <div className="border border-gray-400 py-1.5 px-5 rounded-full text-sm flex items-center gap-1 text-gray-800">
            <RiOpenSourceLine size={20} color="blue" />
            Open source
          </div>
          <div className="space-y-4">
            <h1 className="sm:text-4xl text-3xl leading-[1.4] font-medium">
              Connect, Share and Explore Communities
            </h1>
            <h1 className="px-2 text-gray-800">
              Social platform to connect with people of similar interests
            </h1>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-1.5 sm:px-9 sm:py-2 px-9 py-2 rounded-full shadow-xs border border-gray-300 cursor-pointer bg-black hover:bg-gray-800 text-white"
          >
            <span>Sign in with</span>
            <FcGoogle />
            <span>Google</span>
          </button>
        </div>

        {/* <div className="lg:block hidden">
          <img src={img} alt="" className="w-100 rounded-full h- border-8 border-[#4d1cff] p-2" />
        </div> */}

      </div>

      <div className="w-full flex justify-center items-center gap-1 p-4 text-sm">
        <FaRegCopyright />
        <p>
          Copyright 2025
        </p>
        <PiLineVerticalLight size={20} />
        <a href="https://ujjwalkumar02.github.io/portfolio/" className="hover:underline">
          Ujjwal
        </a>
      </div>
    </div>
  )
}

export default LandingPage