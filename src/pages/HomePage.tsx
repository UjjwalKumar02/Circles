import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Community from "../components/Community";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";


interface CommunityWithRole {
  role: "ADMIN" | "MEMBER"
  community: {
    id: string;
    name: string;
    slug: string;
    desc: string | null;
  }
}


const Home = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [myCommunities, setMyCommunities] = useState<CommunityWithRole[]>([]);
  const [showForm, setShowForm] = useState<null | "create" | "join" | "menu" | "register">(null);

  const [circleName, setCircleName] = useState<string>("");
  const [circleDesc, setCircleDesc] = useState<string>("");

  const [id, setId] = useState("");

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);


  const fetchMyCommunities = async () => {
    setLoading(true);
    const res = await fetch(`${backendUrl}/api/communities/my`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setMyCommunities(data.communities);

    if (!data.hasUsername) {
      setShowForm("register");
    }

    console.log("fetching communities", data)
    setLoading(false);
  };

  useEffect(() => {
    fetchMyCommunities();
  }, []);


  const handleCreate = async () => {
    if (!circleName) {
      alert("Name cant be empty!");
      return;
    }

    setLoading(true);
    const res = await fetch(`${backendUrl}/api/communities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: circleName,
        description: circleDesc
      }),
    });

    if (!res.ok) {
      const err: any = res.json();
      alert("Failed to create circle: " + (err.error || "Unknown error"))
    }

    await fetchMyCommunities();
    setShowForm(null);
    setLoading(false);
    setCircleName("")
    setCircleDesc("")
  };


  const handleJoin = async (id: string) => {
    if (!id) {
      alert("ID cant be empty!");
      return;
    }

    setLoading(true);
    const res = await fetch(`${backendUrl}/api/communities/${id}/join`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Failed to join: " + (err.error || "Unknown error"));
      setLoading(false);
      return;
    }

    await fetchMyCommunities();
    setShowForm(null);
    setLoading(false);
    setId("");
  };


  const handleRegister = async () => {
    if (!username && !name) {
      alert("Fill the details...");
      return;
    }

    setLoading(true);
    const response = await fetch(`${backendUrl}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username,
        name,
        description
      })
    });

    if (!response.ok) {
      const error: any = response.json();
      alert("Error in registering user: " + (error.error || "Unknown error"));

    }
    console.log(response.json());

    setLoading(false);
    setShowForm(null);
  }




  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fff]">
      <Navbar loading={loading} />

      <div className="flex justify-center lg:gap-6">
        <Sidebar />

        <div className="w-full flex-col lg:mt-5 mt-0 lg:w-[42%]">

          <div className="">
            <div className="flex justify-between items-center bg-[#f6f8fa] text-[#1f2328] px-5.5 py-3.5 border-x-[1.5px] border-y-[1.5px] border-x-gray-300 border-t-gray-300 border-b-gray-200 lg:rounded-t-2xl shadow-xs">
              <h2 className="font-medium text-lg w-full py-0.5">
                Communities
              </h2>
              <button
                onClick={() => setShowForm(showForm ? null : "menu")}
                className="lg:hidden block px-1 py-1 rounded-full  cursor-pointer"
              >
                <IoMdAdd size={24} color="black" />
              </button>


            </div>
            {showForm === "menu" && (
              <div className=" justify-end animation transition-all duration-300">
                <button
                  onClick={() => setShowForm("create")}
                  className="w-full text-[#0969da] px-5.5 py-3.5 border-x-[1.5px] border-t-[1.5px] border-gray-300 shadow-xs font-medium cursor-pointer text-right text-sm"
                >
                  Create a new community
                </button>
                <button
                  onClick={() => setShowForm("join")}
                  className="w-full text-[#0969da] px-5.5 py-3.5 border-x-[1.5px] border-t-[1.5px] border-gray-300 shadow-xs font-medium cursor-pointer text-right text-sm"
                >
                  Join a community
                </button>
              </div>
            )}


            {myCommunities.length !== 0 && (
              <div className="w-full shadow-xs border-b-[1.5px] border-gray-300">
                {myCommunities.map(({ community, role }) => (
                  <Link to={`/community/${community.slug}`}>
                    <Community
                      name={community.name}
                      description={community.desc}
                      role={role}
                    />
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>

        <div>
          <div className="sticky top-19 hidden lg:flex h-fit mt-5 bg- text-[#1f2328] border-[1.5px] border-gray-300 px-9 flex-col items-center py-10 gap-4 rounded-2xl shadow-xs">
            <p>
              Create new
              <br />
              community
            </p>
            <button
              onClick={() => setShowForm("create")}
              className="w-full bg-[#f6f8fa] text-[#1f2328] text-sm px-7 py-1 rounded-full font-medium cursor-pointer border-[1.5px] border-gray-300"
            >
              Create
            </button>
          </div>
          <div className="sticky top-68 hidden lg:flex h-fit mt-5 bg- text-[#1f2328] -xl border-[1.5px] border-gray-300 px-9 flex-col items-center py-10 gap-4 rounded-2xl shadow-xs">
            <p>
              Join any
              <br />
              community
            </p>
            <button
              onClick={() => setShowForm("join")}
              className="w-full bg-[#f6f8fa] text-[#1f2328] text-sm px-7 py-1 rounded-full font-medium cursor-pointer border-[1.5px] border-gray-300"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {showForm === "create" && (
        <div
          className="fixed inset-0 bg-black/10 flex items-center justify-center text-[#1f2328]"
        >
          <div className="bg-white px-12 py-9 rounded-2xl shadow flex flex-col gap-4 justify-center">
            <h1 className="text-xl text-center font-medium md:mb-4 mb-1">
              Create a community
            </h1>

            <div className="flex md:flex-row flex-col justify-between md:gap-2 md:items-center">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50"
              />
            </div>
            <div className="flex md:flex-row flex-col justify-between md:items-center md:gap-8">
              <label htmlFor="desc">Description</label>
              <input
                type="text"
                value={circleDesc}
                onChange={(e) => setCircleDesc(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50 "
              />
            </div>
            <div className="w-full flex items-center md:justify-between justify-center gap-2.5 mt-2 text-[#1f2328]">
              <button
                onClick={handleCreate}
                className="md:w-fit px-9 py-1 bg-[#f6f8fa]  rounded-lg font-medium border-[1.5px] border-gray-300 cursor-pointer text-sm shadow-xs w-full"
              >
                Create
              </button>
              <button
                onClick={() => setShowForm(null)}
                className="py-1 px-3 border border-gray-300 rounded-lg font-medium cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm === "join" && (
        <div
          className="fixed inset-0 bg-black/10 flex items-center justify-center text-[#1f2328]"
        >
          <div className="bg-white px-12 py-9 rounded-2xl shadow flex flex-col gap-4 justify-center">

            <h1 className="text-xl text-center font-medium md:mb-4 mb-1">
              Join a Community
            </h1>


            <div className="flex md:flex-row flex-col justify-between md:gap-8 md:items-center">
              <label htmlFor="id">
                Community ID
              </label>
              <input
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder=""
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50"
              />
            </div>
            <div className="w-full flex items-center md:justify-between justify-center gap-2.5 mt-2 text-[#1f2328]">
              <button
                onClick={(e) => { e.preventDefault(); handleJoin(id); }}
                className="md:w-fit px-11 py-1 bg-[#f6f8fa]  rounded-lg font-medium border-[1.5px] border-gray-300 cursor-pointer text-sm shadow-xs w-full"
              >
                Join
              </button>
              <button
                onClick={() => setShowForm(null)}
                className="py-1 px-3 border border-gray-300 rounded-lg font-medium cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showForm === "register" && (
        <div
          className="fixed inset-0 bg-black/10 flex items-center justify-center text-[#1f2328]"
        >
          <div className=" bg-white px-12 py-9 rounded-2xl shadow flex flex-col gap-4 justify-center">
            <h1 className="text-xl text-center font-medium md:mb-4 mb-1">
              Complete your profile
            </h1>

            <div className="flex md:flex-row flex-col justify-between md:gap-8 md:items-center">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50"
              />
            </div>
            <div className="flex md:flex-row flex-col justify-between md:gap-8 md:items-center">
              <label htmlFor="desc">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50"
              />
            </div>
            <div className="flex md:flex-row flex-col justify-between md:gap-8 md:items-center">
              <label htmlFor="desc">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50"
              />
            </div>
            <div className="w-full flex items-center md:justify-between justify-center gap-2.5 mt-2 text-[#1f2328]">
              <button
                onClick={handleRegister}
                className="md:w-fit px-11 py-1 bg-[#f6f8fa]  rounded-lg font-medium border-[1.5px] border-gray-300 cursor-pointer text-sm shadow-xs w-full"
              >
                Register
              </button>
              <button
                onClick={() => setShowForm(null)}
                className="py-1 px-3 border border-gray-300 rounded-lg font-medium cursor-pointer text-sm">
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
