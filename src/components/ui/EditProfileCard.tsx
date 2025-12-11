import { useRef, useState } from "react";
import Button from "./Button";
import { InputBox } from "./InputBox";
import { PopupCard } from "./PopupCard";

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<"edit" | "delete" | null>>;
  fetchUserProfile: () => void;
}

export default function EditProfileCard({ setPopup, fetchUserProfile }: Props) {
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
        size="lg"
      />
      <InputBox
        reference={descriptionRef}
        type="text"
        placeholder="Description"
        size="lg"
      />
      <div className="flex justify-between">
        <Button
          variant="primary"
          size="md"
          text="Update"
          onClick={handleEdit}
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
}
