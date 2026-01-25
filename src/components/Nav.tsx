import { useState } from "react";
import { Menu } from "../icons/Menu";
import { Close } from "../icons/Close";
import { Link, useNavigate } from "react-router-dom";

export function Nav({ avatar }: { avatar: string }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        alert("Request failed");
      }

      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#fffffc] sticky top-0 border-b border-gray-100">
      <div className="max-w-4xl mx-auto flex justify-between items-center mt-1.5 md:py-5 py-6 md:px-4 px-6 md:rounded-xl">
        {/* Logo */}
        <div className="flex gap-1 items-center">
          <div className="bg-[#fde89e] h-7 w-7 flex items-center justify-center rounded-lg font-medium text-xl border border-gray-100">
            @
          </div>
          <h1 className="text-2xl font-medium tracking-tighter">Circles</h1>
        </div>

        {/* Image and Menu btn */}
        <div className="flex gap-3 items-center">
          {avatar == "" ? (
            <div className="w-9 h-9 border border-gray-300 rounded-full"></div>
          ) : (
            <img
              src={avatar}
              alt="profileImage"
              className="w-9 h-9 rounded-full"
            />
          )}

          <button className="md:hidden block" onClick={() => setMenu(true)}>
            <Menu />
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`translate-x transition-all duration-300 min-h-screen w-full fixed top-0 ${menu ? "left-0" : "left-200"} bg-[#fffffc] md:hidden flex flex-col px-6 py-8`}
        >
          <div className="flex justify-end">
            <button className="" onClick={() => setMenu(false)}>
              <Close />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-7 pt-20">
            <Link to={"/home"}>Home</Link>
            <Link to={"/profile"}>Profile</Link>

            <button
              className="text-start cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
