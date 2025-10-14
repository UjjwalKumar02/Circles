import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";


interface UserDetails {
  name: string
  email: string
  avatar: string
  description: string
}

interface UpdatedDetails {
  username: string
  description: string
}


const Profile = () => {
  const [profileDetails, setProfileDetails] = useState<UserDetails | null>(null);

  const [updatedDetails, setUpdatedDetails] = useState<UpdatedDetails>({
    username: profileDetails?.name || "",
    description: profileDetails?.description || ""
  });

  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);


  const fetchProfileDetails = async () => {
    const res = await fetch("http://localhost:5000/users/details", {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();
    setProfileDetails(data);
    console.log("Fetching profile details", data);
  }

  useEffect(() => {
    fetchProfileDetails();
  }, [])


  useEffect(() => {
    if (profileDetails) {
      setUpdatedDetails({
        username: profileDetails.name,
        description: profileDetails.description
      });
    }
  }, [profileDetails]);


  const handleUpdate = async () => {
    setEditLoading(true);
    if (!updatedDetails) return;

    const res = await fetch("http://localhost:5000/users/update", {
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
    setEditLoading(false);
  };


  const deleteUser = async () => {
    try {
      setDeleteLoading(true);
      const res = await fetch("http://localhost:5000/users/delete", {
        method: "DELETE",
        credentials: "include"
      });

      await fetch("http://localhost:5000/auth/logout", {
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
      setDeleteLoading(false);
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="lg:w-[42%] flex flex-col mx-auto mt-30 gap-6">

        <div className="flex flex-col justify-center items-center border border-gray-100 lg:py-6 py-6 lg:px-10 px-10 rounded-lg shadow gap-6 bg-white">

          <div className="w-full flex lg:flex-row flex-col justify-center items-center lg:gap-26 gap-6 lg:px-2">
            {profileDetails && (
              <img
                src={`http://localhost:5000/proxy-image?url=${encodeURIComponent(profileDetails.avatar)}`}
                alt="pic"
                className="rounded-full h-40 w-40 border border-gray-400" />
            )}

            <div className="flex flex-col gap-4 lg:items-start items-center">
              <h1 className="text-2xl font-medium">
                {profileDetails?.name}
              </h1>
              <p>
                {profileDetails?.email}
              </p>
              <p className="text-blue-600">
                {profileDetails?.description}
              </p>
            </div>
          </div>

        </div>

        <div className="flex flex-col justify-center items-center gap-5 mt-2">
          <button
            onClick={() => setShowEdit(true)}
            className="w-fit border border-gray-300 rounded-lg py-1 px-12 shadow cursor-pointer bg-black text-white font-medium"
          >
            Edit profile
          </button>
          <button
            onClick={() => { setShowConfirm(true); console.log(showConfirm) }}
            className="text-red-600 cursor-pointer font-medium"
          >
            Delete your account
          </button>
        </div>

        {showEdit && (
          <div className="fixed inset-0 bg-black/15 flex justify-center items-center">
            <div className="bg-white flex flex-col items-center gap-4 border border-gray-300 py-7 px-13 rounded-2xl shadow-lg">
              <h1 className="text-2xl mb-4 font-medium">
                Edit your profile
              </h1>
              <div className="w-full flex justify-between items-center">
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
                  className="bg-gray-50 border border-gray-300 py-0.5 px-2 rounded" />
              </div>
              <div className="w-full flex justify-between items-center">
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
                  className="bg-gray-50 border border-gray-300 py-0.5 px-2 rounded" />
              </div>

              <div className="w-full flex gap-4 justify-between mt-4">
                <button
                  onClick={handleUpdate}
                  className="w-full border border-gray-200 rounded-xl px-12 py-0.5 cursor-pointer bg-blue-600 text-white">
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setShowEdit(false)}
                  className="w-full border border-gray-300 rounded-xl px-12 py-0.5 cursor-pointer">
                  Cancel
                </button>
              </div>
              <p className="text-sm text-gray-800 mt-1">
                Email and avatar updation will be available soon.
              </p>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 bg-black/25 flex justify-center items-center">
            <div className="bg-white py-10 px-12 rounded-2xl">
              <h1 className="text-lg font-medium">
                Please confirm to delete your account!
              </h1>
              <div className="flex justify-between gap-5 mt-8">
                <button
                  onClick={deleteUser}
                  className="w-full bg-red-600 text-white rounded-lg py-1 cursor-pointer">
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-black text-white rounded-lg py-1 cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;