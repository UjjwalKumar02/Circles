import { useEffect, useState } from "react";
import Button from "../components/Button";
import { CreateCommunityCard } from "../components/CreateCommunityCard";
import { JoinCommunityCard } from "../components/JoinCommunityCard";
import { Link } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Side } from "../components/Side";
import { Community } from "../components/CommunityCard";
import type { CommunityWithRole } from "../types/types";
import { Add } from "../icons/Add";
import { Close } from "../icons/Close";

export default function Home() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [popup, setPopup] = useState<"create" | "join" | null>(null);
  const [responseData, setResponseData] = useState<CommunityWithRole[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [mobileAdd, setMobileAdd] = useState(false);

  const fetchUserCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/community/user/bulk`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const jsonData = await response.json();
      setResponseData(jsonData);
      console.log(responseData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCommunities();
  }, []);

  if (loading) return <div className="px-3">loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-4xl mx-auto flex gap-6 justify-between mt-8">
        {/* Side bar */}

        <Side />

        {/* Main content */}
        <div className="w-full mt-2 px-6">
          <div className="flex justify-between">
            <h1 className="text-xl font-medium tracking-tight ">
              Your Communities
            </h1>
            <div className="md:flex hidden gap-4 items-center">
              <Button
                variant="primary"
                size="md"
                text="Create New"
                onClick={() => setPopup("create")}
              />
              <Button
                variant="primary"
                size="md"
                text="Join by ID"
                onClick={() => setPopup("join")}
              />
            </div>

            {/* Mobile add button */}
            <button
              className="md:hidden block"
              onClick={() => setMobileAdd(!mobileAdd)}
            >
              {mobileAdd ? <Close /> : <Add />}
            </button>
          </div>
          {mobileAdd && (
            <div className="p-6 flex flex-col gap-4">
              <Button
                variant="primary"
                size="sm"
                text="Create New"
                onClick={() => setPopup("create")}
                fullWidth={true}
              />
              <Button
                variant="primary"
                size="sm"
                text="Join by ID"
                onClick={() => setPopup("join")}
                fullWidth={true}
              />
            </div>
          )}

          <div className="flex flex-col gap-5 mt-6">
            {responseData?.length === 0 ? (
              <p>You dont have any communities!</p>
            ) : (
              responseData?.map((c) => (
                <Link to={`/community/${c.community.slug}`}>
                  <Community
                    key={c.community.id as unknown as string}
                    role={c.role}
                    name={c.community.name}
                    desc={c.community.description}
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {popup === "create" && (
        <CreateCommunityCard
          setPopup={setPopup}
          fetchUserCommunity={fetchUserCommunities}
        />
      )}

      {popup === "join" && (
        <JoinCommunityCard
          setPopup={setPopup}
          fetchUserCommunity={fetchUserCommunities}
        />
      )}
    </div>
  );
}
