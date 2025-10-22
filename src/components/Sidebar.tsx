import { NavLink } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { MdOutlineTravelExplore } from "react-icons/md";
import { RiAccountCircle2Line } from "react-icons/ri";


const Sidebar = () => {
  const activeClass = "text-[#0969da] font-medium";
  const defaultClass = "hover:text-[#0969da]";


  return (
    <div className="hidden sticky top-19 lg:flex h-fit mt-5 bg- border-[1.5px] border-gray-300 py-10 px-14 flex-col items-c gap-8 rounded-2xl font- text-[#1f2328] shadow-xs">
      <NavLink
        to="/home"
        className={({ isActive }) => (isActive ? activeClass : defaultClass)}
      >
        <div className="flex gap-[3px] items-">
          <IoMdHome size={20} />
          <p>
            Home
          </p>
        </div>
      </NavLink>
      <NavLink
        to="/explore"
        className={({ isActive }) => (isActive ? activeClass : defaultClass)}
      >
        <div className="flex gap-[3px] items-center">
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
        <div className="flex gap-[3px] items-center">
          <RiAccountCircle2Line size={20} />
          <p>
            Profile
          </p>
        </div>
      </NavLink>
    </div>
  )
}

export default Sidebar