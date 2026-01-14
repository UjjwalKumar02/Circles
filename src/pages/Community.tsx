import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { InputBox } from "../components/InputBox";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";
import { EditCommunityCard } from "../components/EditCommunityCard";
import { ExitCommunityCard } from "../components/ExitCommunityCard";
import { DeleteCommunityCard } from "../components/DeleteCommunityCard";
import { Nav } from "../components/Nav";
import { Side } from "../components/Side";
import { Close } from "../icons/Close";
import { Settings } from "../icons/Settings";
import type { CommunityDetails, Post, ProfileData } from "../types/types";

export default function Community() {
  const { slug } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Response data and wbsocket state variables
  const [responseData, setResponseData] = useState<CommunityDetails | null>(
    null
  );
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Other utility state variables
  const [popup, setPopup] = useState<"edit" | "delete" | "exit" | null>(null);
  const newPostRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileSettings, setMobileSettings] = useState(false);
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLiked, setIsLiked] = useState(false);

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
      const mappedPosts: Post[] = jsonData.posts.map((p: any) => ({
        id: p.id,
        content: p.content,
        authorName: p.author.username,
        authorAvatar: p.author.avatar,
        likeCount: p.likes.length,
        commentCount: p.comments.length,
        createdAt: new Date(p.createdAt),
      }));

      setResponseData({
        id: String(jsonData.id),
        name: jsonData.name,
        description: jsonData.description,
        role: jsonData.members[0].role,
        posts: mappedPosts,
      });

      setPostList(mappedPosts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile details for the websocket messages
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
      setProfileData(jsonData);
      // console.log(jsonData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityDetail();
    fetchUserProfile();

    // Websocket connection
    const ws = new WebSocket(`${backendUrl}`);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: slug,
        })
      );
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Incoming websocket data
  if (socket) {
    socket.onmessage = (e) => {
      const parsedData = JSON.parse(e.data);

      // If the type is chat
      if (parsedData.type === "chat") {
        const post = parsedData.post;

        setPostList((prev) => [
          {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            authorName: post.authorName,
            authorAvatar: post.authorAvatar,
          },
          ...prev,
        ]);
      }

      // If type is toggle_like
      if (parsedData.type === "toggle_like") {
        const post = parsedData.post;

        setPostList((prev) =>
          prev.map((p, i) => (i === parsedData.index ? post : p))
        );
      }
      // console.log(postList);
    };
  }

  // Create new post handler
  const handleCreatePost = async () => {
    if (newPostRef.current?.value === "") {
      alert("Post content is required!");
      return;
    }

    try {
      // Sending new post data to ws
      socket?.send(
        JSON.stringify({
          type: "chat",
          roomId: slug,
          message: {
            id: postList.length + 1,
            content: newPostRef.current?.value,
            createdAt: new Date(),
            likeCount: 0,
            commentCount: 0,
            authorName: profileData?.username,
            authorAvatar: profileData?.avatar,
          },
        })
      );

      // Creating new post in DB
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

      // Cleaning new post ref
      if (newPostRef.current) {
        newPostRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle like handler
  const toggleLike = async ({
    postId,
    index,
  }: {
    postId: number;
    index: number;
  }) => {
    try {
      // sending liked post details to websocket
      let nextLikedState = !isLiked;
      setIsLiked((prev) => !prev);

      const post = postList[index];
      socket?.send(
        JSON.stringify({
          type: "toggle_like",
          roomId: slug,
          index: index,
          message: {
            ...post,
            likeCount: nextLikedState ? post.likeCount + 1 : post.likeCount - 1,
          },
        })
      );

      // Updating like details in db
      await fetch(`${backendUrl}/api/post/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
      throw new Error("Request failed");
    }
  };

  if (loading) return <div className="px-3">loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-4xl mx-auto flex gap-7 justify-between mt-6">
        {/* Side bar */}
        <Side />

        {/* Main content */}
        <div className="w-full px-2">
          {/* Community Header */}
          <div className="bg-white px-9 py-10 flex flex-col gap-7 border border-gray-200 rounded-xl">
            <div className="flex justify-between">
              {/* Community name and role */}
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight">
                  {responseData?.name}
                </h1>
                {responseData?.role === "ADMIN" ? (
                  <p className="text-xs border rounded-xl border-red-500 text-red-500 font-medium px-2 py-1">
                    {responseData?.role}
                  </p>
                ) : (
                  <p className="text-xs border rounded-xl border-sky-500 text-sky-500 font-medium px-2 py-1">
                    {responseData?.role}
                  </p>
                )}
              </div>

              {/* Community settings */}
              <div className="md:flex hidden gap-4 items-center">
                {responseData?.role === "ADMIN" ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      text="Edit community"
                      onClick={() => setPopup("edit")}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      text="Delete community"
                      onClick={() => setPopup("delete")}
                    />
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    text="Exit community"
                    onClick={() => setPopup("exit")}
                  />
                )}
              </div>

              {/* Mobile settings */}
              <button
                className="md:hidden block"
                onClick={() => setMobileSettings(!mobileSettings)}
              >
                {mobileSettings ? <Close /> : <Settings />}
              </button>
            </div>

            {mobileSettings && (
              <div className="flex flex-col px-6 gap-4 items-center">
                {responseData?.role === "ADMIN" ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      text="Edit community"
                      onClick={() => setPopup("edit")}
                      fullWidth={true}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      text="Delete community"
                      onClick={() => setPopup("delete")}
                      fullWidth={true}
                    />
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    text="Exit community"
                    onClick={() => setPopup("exit")}
                    fullWidth={true}
                  />
                )}
              </div>
            )}

            {/* Community ID */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm md:text-normal">CommunityID:</span>
              <span className="text-xs bg-sky- px-2 py-1 rounded-lg border border-gray-200">
                {responseData?.id}
              </span>
            </div>
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-2 mt-2">
            {/*Create new post box*/}
            <div className="bg-white border border-gray-200 rounded-xl px-8 py-4 space-y-4">
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
            {postList.length !== 0 &&
              postList.map((p, index) => (
                <div key={index}>
                  <PostCard
                    author={p.authorName}
                    avatar={p.authorAvatar}
                    content={p.content}
                    likeCount={p.likeCount}
                    commentCount={p.commentCount ?? 0}
                    createdAt={p.createdAt}
                    onClickLike={() => toggleLike({ postId: p.id, index })}
                  />
                </div>
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
