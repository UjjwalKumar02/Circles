import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-19 min-h-screen min-w-60 border-r border-gray-200 flex flex-col items-center pt-10 gap-8">
      <Link to={"/dashboard"}>Dashboard</Link>
      <Link to={"/profile"}>Profile</Link>

      <button
        onClick={() => {
          fetch("http://localhost:3000/api/user/logout", {
            method: "POST",
            credentials: "include",
          }).then((res) => (res.ok ? navigate("/") : console.log(res.json())));
        }}
      >
        Logout
      </button>
    </div>
  );
}
