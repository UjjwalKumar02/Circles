import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiX } from "react-icons/fi";


const Sidebar = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  }

  const activeClass = "text-blue-500";
  const defaultClass = "hover:text-blue-500";

  return (
    <>
      <div className="bg-white lg:flex hidden items-center justify-between fixed top-0 w-full px-8 pt-4 pb-3 border border-gray-300 shadow-xs">
        <h1 className="text-2xl font-medium">
          Circles
        </h1>
        <div className="flex items-center gap-14">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}
          >
            Explore
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}
          >
            Profile
          </NavLink>
        </div>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-5 py-1 rounded-full text-sm font-medium hover:bg-gray-700 cursor-pointer"
        >
          Logout
        </button>
      </div>



      {/* Mobile Nav */}
      <div className="lg:hidden w-full fixed top-0 bg-white p-6 border-b border-gray-300 transition-all duration-300">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium">
            Circles
          </p>
          <button onClick={handleMenuClick} className="cursor-pointer">
            <RxHamburgerMenu size={26} />
          </button>
        </div>
      </div>

      <div className={`fixed top-0 left-0 h-full w-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button
          onClick={() => setIsOpen(false)}
          className="fixed right-0 p-6 cursor-pointer"
        >
          <FiX size={26} />
        </button>
        <div className="flex flex-col items-center justify-center h-full gap-10 text-xl">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}>
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}>
            Explore
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}>
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-left hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar