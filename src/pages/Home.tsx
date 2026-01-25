import { useEffect, useState } from "react";
import { CreateCommunityCard } from "../components/CreateCommunityCard";
import { JoinCommunityCard } from "../components/JoinCommunityCard";
import { useNavigate } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Side } from "../components/Side";
import { Community } from "../components/CommunityCard";
import type { CommunityWithRole, ProfileData } from "../types/types";
import { Add } from "../icons/Add";
import { Close } from "../icons/Close";
import { ButtonV2 } from "../componentsV2/ButtonV2";

export default function Home() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [popup, setPopup] = useState<"create" | "join" | null>(null);
  const [responseData, setResponseData] = useState<CommunityWithRole[] | null>(
    null,
  );
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileAdd, setMobileAdd] = useState(false);
  const navigate = useNavigate();

  // Fetch users communities function
  const fetchUserCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/community/user/bulk`, {
        method: "GET",
        credentials: "include",
      });
      // Route protection
      if (response.status === 405) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const jsonData = await response.json();
      setResponseData(jsonData);
      // console.log(responseData);
    } catch (error) {
      console.log(error);
      alert("Interal server error!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile details function
  const fetchProfileData = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const jsonData = await res.json();
      setProfileData(jsonData);

      localStorage.setItem("username", jsonData?.username);
      localStorage.setItem("avatar", jsonData?.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserCommunities();
    fetchProfileData();
  }, []);

  if (loading) return <div className="px-3">loading...</div>;

  return (
    <div className="min-h-screen bg-[#fffffc]">
      <Nav avatar={profileData?.avatar ?? ""} />

      <div className="max-w-4xl mx-auto flex gap-5 justify-between mt-8">
        {/* Side bar */}
        <Side />

        {/* Main content */}
        <div className="w-full mt-2 px-6 mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight ">
              Your Communities
            </h1>
            <div className="md:flex hidden gap-3 items-center">
              <ButtonV2
                variant="secondary"
                size="md"
                onClick={() => setPopup("create")}
              >
                Create New
              </ButtonV2>
              <ButtonV2
                variant="secondary"
                size="md"
                onClick={() => setPopup("join")}
              >
                Join with ID
              </ButtonV2>
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
              <ButtonV2
                variant="secondary"
                size="md"
                onClick={() => setPopup("create")}
              >
                Create New
              </ButtonV2>
              <ButtonV2
                variant="secondary"
                size="md"
                onClick={() => setPopup("join")}
              >
                Join with ID
              </ButtonV2>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-6">
            {responseData?.length === 0 ? (
              <p>You dont have any communities!</p>
            ) : (
              responseData?.map((c, index) => (
                <Community
                  key={index}
                  role={c.role}
                  name={c.community.name}
                  slug={c.community.slug}
                  desc={c.community.description}
                />
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
