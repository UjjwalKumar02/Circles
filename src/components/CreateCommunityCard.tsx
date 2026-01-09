import { useRef, useState } from "react";
import { PopupCard } from "./PopupWrapper";
import { InputBox } from "./InputBox";
import Button from "./Button";

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<"create" | "join" | null>>;
  fetchUserCommunity: () => void;
}

export const CreateCommunityCard = ({
  setPopup,
  fetchUserCommunity,
}: Props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLInputElement | null>(null);
  const [loading, setloading] = useState(false);

  const handleCreate = async () => {
    try {
      setloading(true);
      if (nameRef.current?.value === "" || descRef.current?.value === "") {
        alert("All fields are required!");
        return;
      }

      const res = await fetch(`${backendUrl}/api/community/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameRef.current?.value,
          description: descRef.current?.value,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Request failed!");
      }

      fetchUserCommunity();
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
      setPopup(null);
    }
  };

  return (
    <PopupCard>
      <h1 className="text-center text-2xl font-medium tracking-tight">
        Create
      </h1>
      <InputBox
        reference={nameRef}
        size="md"
        type="text"
        placeholder="Community Name"
      />
      <InputBox
        reference={descRef}
        size="md"
        type="text"
        placeholder="Community Description"
      />

      <div className="flex justify-between">
        <Button
          variant="primary"
          size="md"
          text="Create"
          onClick={handleCreate}
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
