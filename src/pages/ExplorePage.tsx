import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Community from "../components/Community";
import { Link } from "react-router-dom";

const Explore = () => {
  const [exploreCommunities, setExploreCommunities] = useState([]);

  const fetchCommunities = async () => {
    const res = await fetch("http://localhost:5000/api/communities/explore", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setExploreCommunities(data);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Sidebar />
      <div className="pt-30 p-6 md:max-w-[44%] mx-auto">
        <h3 className="font-medium text-xl text-center">Explore Communities</h3>
        {exploreCommunities.map((community: any) => (
          <li
            key={community.id}
            className="list-none"
          >
            <Link to={`/community/${community.slug}`}>
              <Community
                name={community.name}
                description={community.desc}
                role={"MEMBER"}
                explore={true}
              />
            </Link>
          </li>
        ))}
      </div>
    </div>
  )
}

export default Explore