import { useState } from "react";
import { PopupCard } from "./PopupWrapper";
import { useNavigate } from "react-router-dom";
import type { ExitCommunityProps } from "../types/types";
import { ButtonV2 } from "../componentsV2/ButtonV2";

export function ExitCommunityCard({
  setPopup,
  communityId,
}: ExitCommunityProps) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleExit = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${backendUrl}/api/community/exit/${communityId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Exit request failed!");
      }

      navigate("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPopup(null);
    }
  };

  return (
    <PopupCard>
      <div className="flex flex-col gap-7 py-3">
        <h1 className="text-xl tracking-tight font-medium">
          Please confirm to exit
          <br />
          community.
        </h1>

        <div className="flex gap-3 items-center">
          <ButtonV2
            variant="primary"
            size="md"
            onClick={handleExit}
            disabled={loading}
            loading={loading}
          >
            Exit
          </ButtonV2>
          <ButtonV2
            variant="secondary"
            size="md"
            onClick={() => setPopup(null)}
          >
            Cancel
          </ButtonV2>
        </div>
      </div>
    </PopupCard>
  );
}
