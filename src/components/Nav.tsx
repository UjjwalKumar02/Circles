import { useState } from "react";
import { Menu } from "../icons/Menu";
import { Close } from "../icons/Close";
import { Link, useNavigate } from "react-router-dom";

export function Nav() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate()
  return (
    <div className="bg-white sticky top-0 border-b border-gray-200  shadow-xs">
      <div className="max-w-4xl mx-auto flex justify-between items-center mt-1.5 md:py-5 py-6 md:px-12 px-6 md:rounded-xl">
      <h1 className="text-2xl font-medium tracking-tighter">Circles</h1>
      <button className="md:hidden block" onClick={() => setMenu(true)}>
        <Menu />
      </button>

    
        <div className={`translate-x transition-all duration-300 min-h-screen w-full fixed top-0 ${menu ? "left-0" : "left-200"} bg-white md:hidden flex flex-col px-6 py-8`}>
         <div className="flex justify-end">
           <button className="" onClick={() => setMenu(false)}>
            <Close />
          </button>

          
         </div>
         <div className="flex flex-col items-center gap-7 pt-20">
            
          <Link to={"/home"}>Home</Link>
      <Link to={"/profile"}>Profile</Link>
      <button
        className="text-start cursor-pointer"
        onClick={() => {
          fetch(`${backendUrl}/api/user/logout`, {
            method: "POST",
            credentials: "include",
          }).then((res) => (res.ok ? navigate("/") : console.log(res.json())));
        }}
      >
        Logout
      </button>
          </div>
        </div>
  
    </div>
    </div>
  );
}
