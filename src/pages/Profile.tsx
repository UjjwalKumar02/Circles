import { useEffect, useState } from "react";
import Button from "../components/Button";
import { InputBox } from "../components/InputBox";
import EditProfileCard from "../components/EditProfileCard";
import { DeleteUserCard } from "../components/DeleteUserCard";
import { Nav } from "../components/Nav";
import { Side } from "../components/Side";

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

  if (loading) return <div className="px-3">loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-5xl mx-auto flex gap-8 justify-between mt-8">
        {/* Side bar */}
        <Side />

        {/* Main content */}
        <div className="w-full mt-2">
          <div className="flex justify-between">
            <h1 className="text-xl font-medium tracking-tight ">
              Your Account
            </h1>
            <div className="flex gap-4 items-center">
              <Button
                variant="primary"
                size="md"
                text="Edit profile"
                onClick={() => setPopup("edit")}
              />
              <Button
                variant="primary"
                size="md"
                text="Delete Account"
                onClick={() => setPopup("delete")}
              />
            </div>
          </div>

          {/* Profile */}
          <div className="flex flex-col gap-5 mt-4">
            <div className="space-y-7 w-full bg-white border border-gray-200 rounded-xl">
              <div className="flex py-8 justify-center items-center gap-16">
                <img
                  src={responseData?.avatar}
                  alt="image"
                  className="w-38 h-38 border border-gray-300 rounded-4xl"
                />

                <div className="min-w-[20%] flex justify-between gap-9">
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
          </div>
        </div>
      </div>

      {popup === "edit" && (
        <EditProfileCard
          setPopup={setPopup}
          fetchUserProfile={fetchUserProfile}
        />
      )}

      {popup === "delete" && <DeleteUserCard setPopup={setPopup} />}
    </div>
  );
}
