import { Link, useNavigate } from "react-router-dom";

export function Side() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
    <div className="bg-white md:flex hidden sticky top-20 flex-col gap-6 py-10 px-16 rounded-xl border border-gray-200 h-fit shadow-xs ">
      <Link to={"/home"}>Home</Link>
      <Link to={"/profile"}>Profile</Link>

      <button className="text-start cursor-pointer" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
