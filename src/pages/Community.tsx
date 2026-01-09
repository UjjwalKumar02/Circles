import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { InputBox } from "../components/InputBox";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import { EditCommunityCard } from "../components/EditCommunityCard";
import { ExitCommunityCard } from "../components/ExitCommunityCard";
import { DeleteCommunityCard } from "../components/DeleteCommunityCard";
import type { CommunityPageResponseData } from "../types/types";
import { Nav } from "../components/Nav";
import { Side } from "../components/Side";

export default function Community() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { slug } = useParams();
  const [responseData, setResponseData] =
    useState<CommunityPageResponseData | null>(null);
  const [popup, setPopup] = useState<"edit" | "delete" | "exit" | null>(null);
  const newPostRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch community details
  const fetchCommunityDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/community/${slug}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        alert("Request failed!");
        return;
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
    fetchCommunityDetail();
  }, []);

  // Create new post handler
  const handleCreatePost = async () => {
    if (newPostRef.current?.value === "") {
      alert("Post content is required!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/post/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          content: newPostRef.current?.value,
          communityId: responseData?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert(response.text);
        return;
      }

      fetchCommunityDetail();
      if (newPostRef.current) {
        newPostRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle like handler
  const toggleLike = async (postId: number) => {
    try {
      await fetch(`${backendUrl}/api/post/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });

      fetchCommunityDetail();
    } catch (error) {
      console.log(error);
      throw new Error("Request failed");
    }
  };

  if (loading) return <div className="px-3">loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-5xl mx-auto flex gap-7 justify-between mt-7">
        {/* Side bar */}
        <Side />

        {/* Main content */}
        <div className="w-full">
          <div className="bg-white px-9 py-10 flex flex-col gap-7 border border-gray-200 rounded-xl">
            <div className="flex justify-between">
              {/* Community name and role */}
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight">
                  {responseData?.name}
                </h1>
                {responseData?.members[0].role === "ADMIN" ? (
                  <p className="text-xs border rounded-xl border-red-500 text-red-500 font-medium px-2 py-1">
                    {responseData?.members[0].role}
                  </p>
                ) : (
                  <p className="text-xs border rounded-xl border-sky-500 text-sky-500 font-medium px-2 py-1">
                    {responseData?.members[0].role}
                  </p>
                )}
              </div>

              {/* Community settings */}
              <div className="flex gap-4 items-center">
                {responseData?.members[0].role === "ADMIN" ? (
                  <>
                    <Button
                      variant="secondary"
                      size="md"
                      text="Edit community"
                      onClick={() => setPopup("edit")}
                    />
                    <Button
                      variant="secondary"
                      size="md"
                      text="Delete community"
                      onClick={() => setPopup("delete")}
                    />
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    text="Exit community"
                    onClick={() => setPopup("exit")}
                  />
                )}
              </div>
            </div>

            {/* Community ID */}
            <div className="flex items-center gap-2">
              <span>CommunityID:</span>
              <span className="text-xs bg-sky- px-2 py-1 rounded-lg border border-gray-200">
                {responseData?.id}
              </span>
            </div>
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="bg-white border border-gray-200 rounded-xl px-8 py-4 space-y-4">
              {/*Create new post box*/}
              <div className="flex gap-2">
                <InputBox
                  reference={newPostRef}
                  type="text"
                  size="none"
                  placeholder="Create a new post..."
                  fullWidth={true}
                  borderNone={true}
                />
                <Button
                  variant="primary"
                  size="md"
                  text="Post"
                  onClick={handleCreatePost}
                />
              </div>
            </div>

            {/* All posts */}
            {responseData?.posts.map((p) => (
              <PostCard
                author={p.author.username}
                avatar={p.author.avatar}
                content={p.content}
                likeCount={p.likes.length}
                commentCount={p.comments.length}
                createdAt={p.createdAt}
                onClickLike={() => toggleLike(p.id!)}
              />
            ))}
          </div>
        </div>
      </div>

      {popup === "exit" && <ExitCommunityCard setPopup={setPopup} />}

      {popup === "edit" && (
        <EditCommunityCard
          setPopup={setPopup}
          fetchCommunityDetail={fetchCommunityDetail}
        />
      )}

      {popup === "delete" && <DeleteCommunityCard setPopup={setPopup} />}
    </div>
  );
}
