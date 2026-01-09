import { Link, useNavigate } from "react-router-dom";

export function Side() {
  const navigate = useNavigate();
  return (
    <div className="sticky top-20 bg-white flex flex-col gap-6 py-10 px-18 border border-gray-200 rounded-xl h-fit">
      <Link to={"/dashboard"}>Home</Link>
      <Link to={"/profile"}>Profile</Link>
      <button
        className="text-start cursor-pointer"
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
