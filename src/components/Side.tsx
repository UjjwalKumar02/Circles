import { Link, useNavigate } from "react-router-dom";

export function Side() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  return (
    <div className="md:flex hidden sticky top-20 bg-white flex-col gap-6 py-10 px-16 border border-gray-200 rounded-xl h-fit shadow-xs">
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
  );
}
