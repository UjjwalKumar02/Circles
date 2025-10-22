import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { CiAt } from "react-icons/ci";
import Navbar from "../components/Navbar";


interface UserDetails {
  username: string
  name: string
  email: string
  avatar: string
  description: string
}

interface UpdatedDetails {
  username: string
  name: string
  description: string
}


const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [profileDetails, setProfileDetails] = useState<UserDetails | null>(null);

  const [updatedDetails, setUpdatedDetails] = useState<UpdatedDetails>({
    username: profileDetails?.username || "",
    name: profileDetails?.name || "",
    description: profileDetails?.description || ""
  });

  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);


  const fetchProfileDetails = async () => {
    setLoading(true);
    const res = await fetch(`${backendUrl}/users/details`, {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();
    setProfileDetails(data);
    console.log("Fetching profile details", data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProfileDetails();
  }, [])


  useEffect(() => {
    if (profileDetails) {
      setUpdatedDetails({
        username: profileDetails.username,
        name: profileDetails.name,
        description: profileDetails.description
      });
    }
  }, [profileDetails]);


  const handleUpdate = async () => {
    setLoading(true);
    if (!updatedDetails) {
      alert("All field are required!");
      return;
    }

    const res = await fetch(`${backendUrl}/users/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedDetails)
    });
    console.log("Updatiion in process")

    if (res.ok) {
      fetchProfileDetails();
      setShowEdit(false);
    } else {
      console.log("Update failed")
    }
    setLoading(false);
  };


  const deleteUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/users/delete`, {
        method: "DELETE",
        credentials: "include"
      });

      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        alert("Your account has been deleted.");
        window.location.href = "/";
      } else {
        const err = await res.json();
        alert("Failed to delete account: " + err.error);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting your account.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg--100">
      <Navbar loading={loading} />

      <div className="flex justify-center gap-6">
        <Sidebar />
        <div className="lg:w-[42%] w-full flex flex-col lg:mt-5 mt-0 gap-6">

          <div className="flex flex-col justify-center items-center border-[1.5px] border-gray-300 lg:py-7 py-6 lg:px-10 px-10 lg:rounded-2xl gap-6 bg-white shadow-xs">

            <div className="w-full flex lg:flex-row flex-col justify-center items-center lg:gap-10 gap-6 lg:px-2">
              {profileDetails && (
                <img
                  src={`${backendUrl}/proxy-image?url=${encodeURIComponent(profileDetails.avatar)}`}
                  alt="pic"
                  className="rounded-full h-40 w-40 border border-gray-400" />
              )}

              <div className="flex flex-col gap-2.5 lg:items-start items-center">

                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-medium">
                    {profileDetails?.name}
                  </h1>
                  <p className="flex items-center text-xs text-[#0969da] border-[1.5px] rounded-full px-1.5 py-0.5 font-medium">
                    <CiAt size={18} /> {profileDetails?.username}
                  </p>
                </div>
                <p className="mt-2">
                  {profileDetails?.email}
                </p>
                <p className="text-blue-600">
                  {profileDetails?.description}
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-col justify-center items-center gap-5 ">
            <button
              onClick={() => setShowEdit(true)}
              className="lg:hidden block bg-[#f6f8fa] text-[#1f2328] text-sm px-9 py-1 rounded-xl font-medium cursor-pointer border-[1.5px] border-gray-300 shadow-xs"
            >
              Edit you profile
            </button>
            <button
              onClick={() => { setShowConfirm(true); console.log(showConfirm) }}
              className="text-red-600 cursor-pointer font-medium"
            >
              Delete your account
            </button>
          </div>





        </div>

        <div className="hidden sticky top-19 mt-5 text-[#1f2328] py-10 px-9 border-[1.5px] border-gray-300 rounded-2xl shadow-xs lg:flex flex-col items-center gap-4 h-fit text-center">
          <p>
            Edit
            your
            <br />
            profile
          </p>

          <button
            onClick={() => setShowEdit(true)}
            className="bg-[#f6f8fa] text-[#1f2328] text-sm px-7 py-1 rounded-full font-medium cursor-pointer border-[1.5px] border-gray-300 shadow-xs"
          >
            Edit
          </button>
        </div>
      </div>


      {showConfirm && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center text-[#1f2328]">
          <div className="bg-white px-10 py-9 rounded-2xl shadow flex flex-col gap-4 justify-center">
            <h1 className="text- text-center font-medium md:mb-4 mb-1">
              Please confirm to delete your account!
            </h1>
            <div className="w-full flex items-center md:justify-between justify-between gap-2.5 mt-2 text-[#1f2328]">
              <button
                onClick={deleteUser}
                className="md:w-fit px-9 py-1 bg-[#f6f8fa]  rounded-lg font-medium border-[1.5px] border-gray-300 cursor-pointer text-sm shadow-xs w-full">
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full md:w-fit py-1 px-9 border border-gray-300 rounded-lg font-medium cursor-pointer text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {showEdit && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center text-[#1f2328]">
          <div className="bg-white px-12 py-9 rounded-2xl shadow flex flex-col gap-4 justify-center">
            <h1 className="text-xl text-center font-medium md:mb-4 mb-1">
              Edit your profile
            </h1>
            <div className="flex md:flex-row flex-col justify-between md:gap-2 md:items-center">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={updatedDetails?.username || ""}
                onChange={(e) =>
                  setUpdatedDetails((prev) => ({
                    ...prev!,
                    username: e.target.value
                  }))
                }
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50 " />
            </div>
            <div className="flex md:flex-row flex-col justify-between md:gap-2 md:items-center">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={updatedDetails?.name || ""}
                onChange={(e) =>
                  setUpdatedDetails((prev) => ({
                    ...prev!,
                    username: e.target.value
                  }))
                }
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50 " />
            </div>
            <div className="flex md:flex-row flex-col justify-between md:items-center md:gap-8">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={updatedDetails?.description || ""}
                onChange={(e) =>
                  setUpdatedDetails((prev) => ({
                    ...prev!,
                    description: e.target.value
                  }))
                }
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-blue-50 " />
            </div>

            <div className="w-full flex items-center md:justify-between justify-center gap-2.5 mt-2 text-[#1f2328]">
              <button
                onClick={handleUpdate}
                className="md:w-fit px-9 py-1 bg-[#f6f8fa]  rounded-lg font-medium border-[1.5px] border-gray-300 cursor-pointer text-sm shadow-xs w-full">
                Save
              </button>
              <button
                onClick={() => setShowEdit(false)}
                className="py-1 px-3 border border-gray-300 rounded-lg font-medium cursor-pointer text-sm">
                Cancel
              </button>
            </div>
            {/* <p className="text-sm text-gray-800 mt-1">
                  Email and avatar updation will be available soon.
                </p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;