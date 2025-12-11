import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Titlebar from "../components/ui/Titlebar";
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
        <div className="w-full ml-66 mt-19">
          <Titlebar title="Welcome" />
          <div className="flex justify-center gap-4 mt-2">
            <Button
              variant="primary"
              size="md"
              text="Create community"
              onClick={() => setPopup("create")}
            />
            <Button
              variant="secondary"
              size="md"
              text="Join community"
              onClick={() => setPopup("join")}
            />
          </div>

          <div className="mt-8 flex gap-8">
            {responseData?.map((c: CommunityWithRole) => (
              <CommunityCard
                key={c.community.id}
                role={c.role}
                name={c.community.name}
                description={c.community.description}
              />
            ))}
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
