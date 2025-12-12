import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Wrapper from "../components/ui/Wrapper";
import { InputBox } from "../components/ui/InputBox";
import EditProfileCard from "../components/ui/EditProfileCard";
import { DeleteUserCard } from "../components/ui/DeleteUserCard";

interface ResponseData {
  username: string;
  email: string;
  avatar: string;
  description: string;
}

export default function Profile() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<"edit" | "delete" | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      const jsonData = await res.json();
      setResponseData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <Wrapper>
      {loading ? (
        <div className="w-full ml-66 mt-19">
          <p>loading...</p>
        </div>
      ) : (
        <div className="w-full ml-60 mt-19 px-8 flex justify-between">
          <div className="mt-6 space-y-7 w-full">
            <div className="flex pt-5 justify-center items-center gap-16 mb-10">
              <img
                src={responseData?.avatar}
                alt="image"
                className="w-50 h-50 border border-gray-300 rounded-4xl"
              />

              <div className="min-w-[20%] flex justify-between gap-10">
                <ul className="space-y-6">
                  <li>Username:</li>
                  <li>Email:</li>
                  <li>Description:</li>
                </ul>
                <div className="flex flex-col gap-3">
                  <InputBox
                    size="sm"
                    type="text"
                    value={responseData?.username}
                    fullWidth={true}
                    disabled={true}
                  />
                  <InputBox
                    size="sm"
                    type="text"
                    value={responseData?.email}
                    fullWidth={true}
                    disabled={true}
                  />
                  <InputBox
                    size="sm"
                    type="text"
                    value={responseData?.description || "null"}
                    fullWidth={true}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="min-w-60 flex flex-col h-fit gap-4 mt-6 border border-gray-300 py-8 px-6 mr-8  rounded-md">
            <h1 className="text-center tracking-tight text-lg mb-6">
              Profile Settings
            </h1>
            <Button
              variant="secondary"
              size="md"
              text="Edit Details"
              onClick={() => setPopup("edit")}
              fullWidth={true}
            />
            <Button
              variant="secondary"
              size="md"
              text="Delete Account"
              onClick={() => setPopup("delete")}
              fullWidth={true}
            />
          </div>
        </div>
      )}

      {popup === "edit" && (
        <EditProfileCard
          setPopup={setPopup}
          fetchUserProfile={fetchUserProfile}
        />
      )}

      {popup === "delete" && <DeleteUserCard setPopup={setPopup} />}
    </Wrapper>
  );
}
