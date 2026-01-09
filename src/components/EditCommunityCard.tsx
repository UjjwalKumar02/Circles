import { useRef, useState } from "react";
import Button from "./Button";
import { InputBox } from "./InputBox";
import { PopupCard } from "./PopupWrapper";
import type { EditCommunityProps } from "../types/types";

export function EditCommunityCard({
  setPopup,
  communityId,
  communitName,
  communitDesc,
  fetchCommunityDetail,
}: EditCommunityProps) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  // Edit details handler
  const handleEdit = async () => {
    if (nameRef.current?.value === "" || descriptionRef.current?.value === "") {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${backendUrl}/api/community/${communityId}/profile`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            name: nameRef.current?.value,
            description: descriptionRef.current?.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        alert(res.json);
        return;
      }

      fetchCommunityDetail();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
      setPopup(null);
    }
  };

  return (
    <PopupCard>
      <h1 className="text-2xl font-medium tracking-tight text-center">
        Edit Community
      </h1>
      <InputBox
        reference={nameRef}
        value={communitName}
        type="text"
        placeholder="Community name"
        size="md"
      />
      <InputBox
        reference={descriptionRef}
        value={communitDesc}
        type="text"
        placeholder="Description"
        size="md"
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
