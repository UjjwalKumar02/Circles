import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Wrapper from "../components/ui/Wrapper";
import CommunityCard from "../components/ui/CommunityCard";
import { CreateCommunityCard } from "../components/ui/CreateCommunityCard";
import { JoinCommunityCard } from "../components/ui/JoinCommunityCard";

interface CommunityWithRole {
  role: string;
  community: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
}

export default function Dashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [popup, setPopup] = useState<"create" | "join" | null>(null);
  const [responseData, setResponseData] = useState<CommunityWithRole[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

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

  return (
    <Wrapper>
      {loading ? (
        <div className="w-full ml-66 mt-19">
          <p>loading...</p>
        </div>
      ) : (
        <div className="w-full ml-60 mt-19 px-8 flex justify-between">
          <div className="mt-6 space-y-7">
            <h1 className="text-2xl font-medium tracking-tighter px-1.5">
              Your Communities
            </h1>

            <div className="flex flex-wrap gap-4">
              {responseData?.map((c: CommunityWithRole) => (
                <CommunityCard
                  key={c.community.id}
                  role={c.role}
                  name={c.community.name}
                  description={c.community.description}
                />
              ))}
            </div>
          </div>

          <div className="min-w-60 flex flex-col h-fit gap-4 mt-6 border border-gray-300 py-8 px-6 mr-8  rounded-md">
            <h1 className="text-center tracking-tight text-lg mb-6">
              Add Community
            </h1>
            <Button
              variant="secondary"
              size="md"
              text="Create a New One"
              onClick={() => setPopup("create")}
              fullWidth={true}
            />
            <Button
              variant="secondary"
              size="md"
              text="Join by ID"
              onClick={() => setPopup("join")}
              fullWidth={true}
            />
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
      )}
    </Wrapper>
  );
}
