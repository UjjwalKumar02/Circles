import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Wrapper from "../components/ui/Wrapper";
import Titlebar from "../components/ui/Titlebar";
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

      // image loading jugaad
      if (responseData === null) return;
      const imageRefresh = async () => {
        await fetch(`${responseData.avatar}`, {
          method: "GET",
        });
      };

      imageRefresh();
      imageRefresh();
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
      <div className=" ml-60 mt-19 w-full flex flex-col items-center">
        {loading ? (
          <p>loading...</p>
        ) : (
          <div className="w-full flex flex-col items-center">
            <Titlebar title="Your Account" />
            <div className="flex pt-5 justify-center items-end gap-16 mb-10">
              <img
                src={responseData?.avatar}
                alt="image"
                className="w-50 h-50 border border-gray-300 rounded-4xl"
              />

              <div className="space-y-5 pb-1">
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

                <Button
                  variant="primary"
                  size="md"
                  text="Edit details"
                  onClick={() => setPopup("edit")}
                  fullWidth={true}
                />
              </div>
            </div>
            <Button
              variant="secondary"
              size="md"
              text="Delete account"
              onClick={() => setPopup("delete")}
            />
          </div>
        )}
      </div>

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
