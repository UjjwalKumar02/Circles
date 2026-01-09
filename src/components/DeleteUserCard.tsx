import { useState } from "react";
import { PopupCard } from "./PopupWrapper";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

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
        <Button
          variant="primary"
          size="md"
          text="Delete"
          onClick={handleDelete}
          disabled={loading}
        />
        <Button
          variant="secondary"
          size="md"
          text="Cancel"
          onClick={() => setPopup(null)}
        />
      </div>
    </PopupCard>
  );
};
