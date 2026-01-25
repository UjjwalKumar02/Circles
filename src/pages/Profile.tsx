import { useEffect, useState } from "react";
import { InputBox } from "../components/InputBox";
import EditProfileCard from "../components/EditProfileCard";
import { DeleteUserCard } from "../components/DeleteUserCard";
import { Nav } from "../components/Nav";
import { Side } from "../components/Side";
import { Add } from "../icons/Add";
import { Close } from "../icons/Close";
import { useNavigate } from "react-router-dom";
import { ButtonV2 } from "../componentsV2/ButtonV2";

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
  const [mobileAdd, setMobileAdd] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/user/profile`, {
        method: "GET",
        credentials: "include",
      });
      // Route protection
      if (res.status === 405) {
        navigate("/");
        return;
      }

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const jsonData = await res.json();
      setResponseData(jsonData);
      // console.log(jsonData);
    } catch (error) {
      console.log(error);
      alert("Interal server error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) return <div className="px-3">loading...</div>;

  return (
    <div className="min-h-screen bg-[#fffffc]">
      <Nav avatar={responseData?.avatar ?? ""} />

      <div className="max-w-4xl mx-auto flex gap-8 justify-between mt-8">
        {/* Side bar */}
        <Side />

        {/* Main content */}
        <div className="w-full mt-2 px-4">
          <div className="flex justify-between">
            <h1 className="text-xl font-medium tracking-tight ">
              Your Account
            </h1>
            <div className="md:flex hidden gap-4 items-center">
              <ButtonV2
                variant="primary"
                size="md"
                onClick={() => setPopup("edit")}
              >
                Edit profile
              </ButtonV2>
              <ButtonV2
                variant="primary"
                size="md"
                onClick={() => setPopup("delete")}
              >
                Delete Account
              </ButtonV2>
            </div>

            {/* Mobile Btn */}
            <button
              className="md:hidden block"
              onClick={() => setMobileAdd(!mobileAdd)}
            >
              {mobileAdd ? <Close /> : <Add />}
            </button>
          </div>
          {mobileAdd && (
            <div className="p-6 flex flex-col gap-4">
              <ButtonV2
                variant="primary"
                size="md"
                onClick={() => setPopup("edit")}
              >
                Edit profile
              </ButtonV2>
              <ButtonV2
                variant="primary"
                size="md"
                onClick={() => setPopup("delete")}
              >
                Delete Account
              </ButtonV2>
            </div>
          )}

          {/* Profile */}
          <div className="flex flex-col gap-5 mt-4">
            <div className="space-y-7 w-full bg-white border border-gray-200 rounded-2xl shadow-xs">
              <div className="flex md:flex-row flex-col py-8 justify-center items-center gap-16">
                <img
                  src={responseData?.avatar}
                  alt="image"
                  className="w-38 h-38 border border-gray-300 rounded-4xl"
                />

                <div className="min-w-[20%] flex justify-between md:gap-8 gap-1">
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
          username={responseData?.username}
          description={responseData?.description}
        />
      )}

      {popup === "delete" && <DeleteUserCard setPopup={setPopup} />}
    </div>
  );
}
