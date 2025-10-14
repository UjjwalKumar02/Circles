import { useState } from "react";
import Sidebar from "../components/Sidebar";

const Explore = () => {
  // const [exploreCommunities, setExploreCommunities] = useState([]);

  // const handleExplore = async () => {
  //   const res = await fetch("http://localhost:5000/api/communities", {
  //     method: "GET",
  //     credentials: "include",
  //   });
  //   const data = await res.json();
  //   setExploreCommunities(data);
  // };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Sidebar />
      <h3 className="pt-30">Explore Communities</h3>
      {/* {exploreCommunities.map((c: any) => (
              <div
                key={c.id}
                className="flex justify-between p-2 border rounded mb-2"
              >
                <span>{c.name}</span>
                <button
                  // onClick={() => handleJoin(c.id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded"
                >
                  Request to Join
                </button>
              </div>
            ))} */}
    </div>
  )
}

export default Explore