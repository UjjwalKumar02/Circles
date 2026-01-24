import { useRef, useState } from "react";
import { PopupCard } from "./PopupWrapper";
import { InputBox } from "./InputBox";
import { ButtonV2 } from "../componentsV2/ButtonV2";

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<"create" | "join" | null>>;
  fetchUserCommunity: () => void;
}

export const JoinCommunityCard = ({ setPopup, fetchUserCommunity }: Props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const idRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoin = async (id: string) => {
    try {
      setLoading(true);
      if (idRef.current?.value === "") {
        alert("Id field is required!");
        return;
      }
      const res = await fetch(`${backendUrl}/api/community/join/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Request failed!");
      }

      fetchUserCommunity();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPopup(null);
    }
  };

  return (
    <PopupCard>
      <h1 className="text-center text-2xl font-medium tracking-tight">Join</h1>
      <InputBox
        reference={idRef}
        size="md"
        type="text"
        placeholder="Community Id"
      />

      <div className="flex justify-between">
        <ButtonV2
          variant="primary"
          size="md"
          onClick={() => handleJoin(idRef.current?.value!)}
          disabled={loading}
          loading={loading}
        >
          Join
        </ButtonV2>
        <ButtonV2 variant="secondary" size="md" onClick={() => setPopup(null)}>
          Cancel
        </ButtonV2>
      </div>
    </PopupCard>
  );
};
