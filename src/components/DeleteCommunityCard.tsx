import { useState } from "react";
import { PopupCard } from "./PopupWrapper";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface Props {
  setPopup: React.Dispatch<
    React.SetStateAction<"edit" | "delete" | "exit" | null>
  >;
  communityId?: number;
}

export const DeleteCommunityCard = ({ setPopup, communityId }: Props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Delete handler
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${backendUrl}/api/community/${communityId}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Request failed!");
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
        <h1 className="text-xl font-medium tracking-tight mb-2">
          Please confirm to delete
          <br />
          Community
        </h1>

        <div className="flex justify-between gap-4">
          <Button
            variant="primary"
            size="md"
            text="Delete"
            onClick={handleDelete}
            disabled={loading}
            fullWidth={true}
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
};
