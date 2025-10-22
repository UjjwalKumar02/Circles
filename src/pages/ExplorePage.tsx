import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Community from "../components/Community";
import Navbar from "../components/Navbar";
import { LuMessageSquare } from "react-icons/lu";

const Explore = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [exploreCommunities, setExploreCommunities] = useState([]);

  const [Content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchCommunities = async () => {
    setLoading(true);
    const res = await fetch(`${backendUrl}/api/communities/explore`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setExploreCommunities(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar loading={loading} />

      <div className="flex justify-center gap-6">
        <Sidebar />
        <div className="lg:pt-5 pt-0 lg:max-w-[44%] w-full  border-b-[1.5px] border-gray-300">
          <div className="flex justify-between items-center bg-[#f6f8fa] text-[#1f2328] px-5.5 py-3.5 border-x-[1.5px] border-y-[1.5px] border-x-gray-300 border-t-gray-300 border-b-gray-200 lg:rounded-t-2xl shadow-xs">
            <h2 className="font-medium text-lg w-full py-0.5">
              Communities
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="lg:hidden block px-1 py-1 rounded-full  cursor-pointer"
            >
              <LuMessageSquare size={24} color="black" />
            </button>
          </div>

          {exploreCommunities.map((community: any) => (
            <li
              key={community.id}
              className="list-none shadow-xs"
            >
              <Community
                name={community.name}
                description={community.desc}
                role={"MEMBER"}
              />
            </li>
          ))}
        </div>

        <div className="hidden sticky top-19 h-fit mt-5 text-[#1f2328] shadow-xs border-[1.5px] border-gray-300 px-9 lg:flex flex-col items-center py-8 gap-4 rounded-2xl">
          <p className="text-center">
            Suggest
            <br />
            new
            <br />
            features
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="bg-[#f6f8fa] text-[#1f2328] text-sm px-7 py-1 rounded-full font-medium cursor-pointer border-[1.5px] border-gray-300"
          >
            Click
          </button>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/10 flex items-center justify-center text-[#1f2328]"
        >
          <div className="bg-white px-12 py-9 rounded-2xl shadow flex flex-col gap-4 justify-center">
            <h1 className="text-xl text-center font-medium md:mb-4 mb-1">
              Suggest new features
            </h1>

            <div className="flex md:flex-row flex-col justify-between md:gap-8 md:items-center">
              <label htmlFor="id">
                Message
              </label>
              <input
                name="id"
                value={Content}
                onChange={(e) => setContent(e.target.value)}
                placeholder=""
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50"
              />
            </div>
            <div className="w-full flex items-center md:justify-between justify-center gap-2.5 mt-2 text-[#1f2328]">
              <button
                // onClick={(e) => { e.preventDefault(); handleJoin(id); }}
                className="md:w-fit px-11 py-1 bg-[#f6f8fa]  rounded-lg font-medium border-[1.5px] border-gray-300 cursor-pointer text-sm shadow-xs w-full"
              >
                Send
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="py-1 px-3 border border-gray-300 rounded-lg font-medium cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Explore