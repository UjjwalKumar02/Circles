import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Community from "../components/Community";
import { IoMdAdd } from "react-icons/io";
// import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";


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
  const [myCommunities, setMyCommunities] = useState<CommunityWithRole[]>([]);
  const [showForm, setShowForm] = useState<null | string>(null);
  const [circleName, setCircleName] = useState<string>("");
  const [circleDesc, setCircleDesc] = useState<string>("");
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [id, setId] = useState("");


  const fetchMyCommunities = async () => {
    const res = await fetch("http://localhost:5000/api/communities/my", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setMyCommunities(data);
    console.log("fetching communities", data)
  };

  useEffect(() => {
    fetchMyCommunities();
  }, []);


  const handleCreate = async () => {
    setCreateLoading(true);
    const res = await fetch("http://localhost:5000/api/communities", {
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
    setCreateLoading(false);
    setCircleName("")
    setCircleDesc("")
  };


  const handleJoin = async (id: string) => {
    setJoinLoading(true);
    const res = await fetch(`http://localhost:5000/api/communities/${id}/join`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
    const err = await res.json();
    alert("Failed to join: " + (err.error || "Unknown error"));
    return;
  }

    await fetchMyCommunities();
    setShowForm(null);
    setJoinLoading(false);
  };


  return (
    <div className="min-h-screen flex mx-auto bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 pt-26 lg:max-w-[44%] mx-auto">

        {/* <Community /> */}
        {myCommunities.length === 0 ? (
          <div className="mt-10">
            <p className="text-center text-xl font-medium">
              You don't have any communities yet.
            </p>
            <div className="w-fit flex flex-col gap-4 mt-10 mx-auto">
              <button
                onClick={() => setShowForm("create")}
                className="px-12 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 cursor-pointer shadow"
              >
                Create a new Circle
              </button>
              <button
                onClick={() => setShowForm("join")}
                className="px-12 py-1.5 bg-white hover:bg-gray-100 cursor-pointer shadow border border-gray-300 rounded-lg"
              >
                Join an existing Circle
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex justify-between mb-6 ">
              <h2 className="text-xl font-medium">
                Your communities
              </h2>
              <button
                onClick={() => setShowForm(showForm ? null : "menu")}
                className="px-1 py-1 rounded-full bg-gray-800 cursor-pointer"
              >
                <IoMdAdd size={24} color="white"/>
              </button>

              
            </div>
            {showForm === "menu" && (
              <div className="flex gap-2 justify-end animation transition-all duration-300">
                <button
                  onClick={() => setShowForm("create")}
                  className="px-4 py-1.5 bg-black text-white border border-gray-400 rounded-lg shadow font-medium cursor-pointer"
                >
                  Create a new community
                </button>
                <button
                  onClick={() => setShowForm("join")}
                  className="px-4 py-1.5 bg-white text-gray-800 border border-gray-400 rounded-lg shadow font-medium cursor-pointer"
                >
                  Join an existing community
                </button>
              </div>
            )}


            <div>
              {myCommunities.map(({ community, role }) => (
                <li 
                  key={community.id} 
                  className="list-none"
                >
                  <Link to={`/community/${community.slug}`}>
                    <Community 
                      name={community.name} 
                      description={community.desc} 
                      role={role}
                      explore={false}
                    />
                  </Link>
                </li>
              ))}
            </div>

          </div>
        )}



        {/* Conditional forms */}
        {showForm === "create" && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center"
          >
            <div className="bg-white px-12 py-9 rounded-xl shadow flex flex-col gap-4 justify-center">
              <h1 className="text-2xl text-center font-medium mb-4">
                Create a new Community
              </h1>

              <div className="flex justify-between">
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
              <div className="flex justify-between">
                <label htmlFor="desc">Description</label>
                <input
                  type="text"
                  value={circleDesc}
                  onChange={(e) => setCircleDesc(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50"
                />
              </div>
              <div className="w-full flex items-center justify-between gap-2.5 mt-2">
                <button
                  onClick={handleCreate}
                  className="w-fit px-9 py-1 bg-blue-600 text-white rounded-lg font-medium cursor-pointer text-sm"
                >
                  {createLoading ? "Loading..." : "Create"}
                </button>
                <button
                  onClick={() => setShowForm(null)}
                  className="py-1 px-3 border border-gray-300 rounded-full font-medium cursor-pointer text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm === "join" && (
          <div
            className="fixed inset-0 bg-black/10 flex justify-center items-center"
          >
            <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 justify-center lg:w-96 ">
              <div className="flex justify-between items-center mb-2 gap-4">
                <h1 className="lg:text-lg font-medium">
                  Join a Community
                </h1>
                <button onClick={() => setShowForm(null)} className="cursor-pointer border border-gray-300 py-1 px-3 rounded-full text-sm font-medium">
                  Close
                </button>
              </div>
              <input
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Community ID"
                className="border border-gray-400 px-2 py-1 rounded-lg"
              />
              <button
                onClick={(e) => {e.preventDefault(); handleJoin(id);}}
                className="w-fit mt-1 px-9 py-1 bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer"
              >
                {joinLoading ? "Joining..." : "Join"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
