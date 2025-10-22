import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiX } from "react-icons/fi";
import { MdOutlineLogout, MdOutlineTravelExplore } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { RiAccountCircle2Line } from "react-icons/ri";

interface NavbarProps {
  loading: boolean
}

const Navbar = ({ loading }: NavbarProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
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
      <div className="bg-[#f6f8fa] text-[#1f2328] lg:flex hidden items-center justify-between sticky top-0 w-full px-8 pt-4 pb-3 border-b-[1.5px] border-gray-300 ">
        <h1 className="text-xl font-medium">
          Circles
        </h1>
        <div className="flex items-center gap-14">

        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-[#1f2328] px-5 py-1 rounded-full text-sm font-medium hover:bg-gray-50 cursor-pointer border-[1.5px] border-gray-300 flex items-center gap-[3px]"
        >
          <MdOutlineLogout size={18} />
          Logout
        </button>
      </div>




      {/* Mobile Nav */}
      <div className="lg:hidden w-full sticky top-0 bg-[#f6f8fa] text-[#1f2328] p-6 border-b border-gray-300 transition-all duration-300">
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
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}
          >
            <div className="flex gap-[5px] items-">
              <IoMdHome size={20} className="mt-0.5" />
              <p>
                Home
              </p>
            </div>
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}
          >
            <div className="flex gap-[5px] items-center">
              <MdOutlineTravelExplore size={18} />
              <p>
                Explore
              </p>
            </div>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? activeClass : defaultClass)}
          >
            <div className="flex gap-[5px] items-center">
              <RiAccountCircle2Line size={20} />
              <p>
                Profile
              </p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-left hover:text-red-400 flex items-center gap-[5px]"
          >
            <MdOutlineLogout size={18} />
            Logout
          </button>
        </div>

        {loading && (
          <div className="relative h-1 w-full overflow-hidden">
            <div
              className="absolute h-full w-1/3 bg-blue-500 animate-moving-bar"
              style={{
                animation: 'loading-bar 1.2s linear infinite'
              }}
            ></div>
          </div>
        )}

      </div>

      {loading && (
        <div className="relative h-1 w-full overflow-hidden">
          <div
            className="absolute h-full w-1/3 bg-blue-500 animate-moving-bar"
            style={{
              animation: 'loading-bar 1.2s linear infinite'
            }}
          ></div>
        </div>
      )}
    </>
  )
}

export default Navbar