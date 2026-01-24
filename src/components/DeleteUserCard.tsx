import { useState } from "react";
import { PopupCard } from "./PopupWrapper";
import { useNavigate } from "react-router-dom";
import { ButtonV2 } from "../componentsV2/ButtonV2";

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<"edit" | "delete" | null>>;
}

export const DeleteUserCard = ({ setPopup }: Props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Request failed!");
      }

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPopup(null);
    }
  };

  return (
    <PopupCard>
      <h1 className="text-xl font-medium tracking-tight mb-2">
        Please confirm to delete
        <br />
        your account!
      </h1>

      <div className="flex justify-between gap-4">
        <ButtonV2
          variant="primary"
          size="md"
          onClick={handleDelete}
          loading={loading}
          disabled={loading}
        >
          Delete
        </ButtonV2>
        <ButtonV2 variant="secondary" size="md" onClick={() => setPopup(null)}>
          Cancel
        </ButtonV2>
      </div>
    </PopupCard>
  );
};
