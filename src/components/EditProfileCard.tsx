import { useRef, useState } from "react";
import { PopupCard } from "./PopupWrapper";
import { InputBox } from "./InputBox";
import { ButtonV2 } from "../componentsV2/ButtonV2";

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<"edit" | "delete" | null>>;
  fetchUserProfile: () => void;
  username?: string;
  description?: string;
}

export default function EditProfileCard({
  setPopup,
  fetchUserProfile,
  username,
  description,
}: Props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const handleEdit = async () => {
    try {
      setLoading(true);
      if (
        usernameRef.current?.value === "" ||
        descriptionRef.current?.value === ""
      ) {
        alert("All fields are required!");
        return;
      }
      console.log(usernameRef.current?.value, descriptionRef.current?.value);
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          username: usernameRef.current?.value,
          description: descriptionRef.current?.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      fetchUserProfile();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPopup(null);
    }
  };

  return (
    <PopupCard>
      <h1 className="text-2xl font-medium tracking-tight text-center">Edit</h1>
      <InputBox
        reference={usernameRef}
        type="text"
        placeholder="Username"
        size="md"
        value={username}
      />
      <InputBox
        reference={descriptionRef}
        type="text"
        placeholder="Description"
        size="md"
        value={description}
      />
      <div className="flex justify-between">
        <ButtonV2
          variant="primary"
          size="md"
          onClick={handleEdit}
          loading={loading}
          disabled={loading}
        >
          Update
        </ButtonV2>
        <ButtonV2 variant="secondary" size="md" onClick={() => setPopup(null)}>
          Cancel
        </ButtonV2>
      </div>
    </PopupCard>
  );
}
