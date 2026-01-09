import { useState } from "react";
import Button from "./Button";
import { PopupCard } from "./PopupWrapper";
import { useNavigate } from "react-router-dom";
import type { ExitCommunityProps } from "../types/types";

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
        }
      );

      if (!res.ok) {
        throw new Error("Exit request failed!");
      }

      navigate("/dashboard");
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
          <Button
            variant="primary"
            size="md"
            text="Exit"
            onClick={handleExit}
            fullWidth={true}
            disabled={loading}
          />
          <Button
            variant="secondary"
            size="md"
            text="Cancel"
            onClick={() => setPopup(null)}
            fullWidth={true}
          />
        </div>
      </div>
    </PopupCard>
  );
}
