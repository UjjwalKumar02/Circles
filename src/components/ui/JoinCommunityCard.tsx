import { useRef, useState } from "react";
import Button from "./Button";
import { InputBox } from "./InputBox";
import { PopupCard } from "./PopupCard";

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<"create" | "join" | null>>;
  fetchUserCommunity: () => void;
}

export const JoinCommunityCard = ({ setPopup, fetchUserCommunity }: Props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const idRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoin = async (id: number) => {
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
        size="lg"
        type="text"
        placeholder="Community Id"
      />

      <div className="flex justify-between">
        <Button
          variant="primary"
          size="md"
          text="Join"
          onClick={() => handleJoin(Number(idRef.current?.value))}
          disabled={loading ? true : false}
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
