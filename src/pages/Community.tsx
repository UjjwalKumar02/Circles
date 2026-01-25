import { useEffect, useRef, useState } from "react";
import { InputBox } from "../components/InputBox";
import PostCard from "../components/PostCard";
import { useNavigate, useParams } from "react-router-dom";
import { EditCommunityCard } from "../components/EditCommunityCard";
import { ExitCommunityCard } from "../components/ExitCommunityCard";
import { DeleteCommunityCard } from "../components/DeleteCommunityCard";
import { Nav } from "../components/Nav";
import { Side } from "../components/Side";
import { Close } from "../icons/Close";
import { Settings } from "../icons/Settings";
import type { CommunityDetails, Post } from "../types/types";
import { ButtonV2 } from "../componentsV2/ButtonV2";

export default function Community() {
  const { slug } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Response data and wbsocket state variables
  const [responseData, setResponseData] = useState<CommunityDetails | null>(
    null,
  );
  const [postList, setPostList] = useState<Post[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  // Other utility state variables
  const newPostRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<"edit" | "delete" | "exit" | null>(null);
  const [mobileSettings, setMobileSettings] = useState(false);
  const navigate = useNavigate();

  // Fetch community details
  const fetchCommunityDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/community/${slug}`, {
        method: "GET",
        credentials: "include",
      });
      // Route protection
      if (res.status === 405) {
        navigate("/");
        return;
      }

      if (!res.ok) {
        throw new Error("Request failed!");
      }

      const jsonData = await res.json();
      const mappedPosts: Post[] = jsonData.posts.map((p: any) => ({
        id: p.id,
        content: p.content,
        authorName: p.author.username,
        authorAvatar: p.author.avatar,
        likeCount: p.likesCount,
        isLiked: p.likes.length > 0,
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
      // console.log(mappedPosts);
    } catch (error) {
      console.log(error);
      alert("Interal server error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityDetail();
    setUsername(localStorage.getItem("username") ?? "");
    setAvatar(localStorage.getItem("avatar") ?? "");

    // Websocket connection
    const ws = new WebSocket(`${backendUrl}`);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: slug,
        }),
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
          prev.map((p) => {
            if (p.id !== post.id) return p;
            return {
              ...p,
              likeCount: post.likeCount,
            };
          }),
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

      // Sending new post data to ws
      socket?.send(
        JSON.stringify({
          type: "chat",
          roomId: slug,
          message: {
            id: postList[0].id + 1,
            content: newPostRef.current?.value,
            createdAt: new Date(),
            likeCount: 0,
            authorName: username,
            authorAvatar: avatar,
          },
        }),
      );

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
    const prevLiked = postList[index].isLiked;
    const prevLikeCount = postList[index].likeCount;

    setPostList((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        return {
          ...p,
          isLiked: !prevLiked,
          likeCount: prevLiked ? prevLikeCount - 1 : prevLikeCount + 1,
        };
      }),
    );

    try {
      // Updating like details in db
      const res = await fetch(`${backendUrl}/api/post/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }

      // sending liked post details to websocket
      socket?.send(
        JSON.stringify({
          type: "toggle_like",
          roomId: slug,
          message: {
            id: postId,
            likeCount: prevLiked ? prevLikeCount - 1 : prevLikeCount + 1,
          },
        }),
      );
    } catch (error) {
      console.log(error);

      // Making like to previous state
      setPostList((prev) =>
        prev.map((p, i) => {
          if (i !== index) return p;
          return {
            ...p,
            isLiked: prevLiked,
            likeCount: prevLikeCount,
          };
        }),
      );

      throw new Error("Request failed");
    }
  };

  if (loading) return <div className="px-3">loading...</div>;

  return (
    <div className="min-h-screen bg-[#fffffc]">
      <Nav avatar={avatar} />
      <div className="max-w-4xl mx-auto flex gap-6 justify-between mt-6">
        {/* Side bar */}
        <Side />

        {/* Main content */}
        <div className="w-full px-4 mb-10">
          {/* Community Header */}
          <div className="bg-white border border-gray-200 px-9 py-10 flex flex-col gap-7 rounded-xl shadow-xs">
            <div className="flex justify-between">
              {/* Community name and role */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-medium tracking-tight">
                  {responseData?.name}
                </h1>

                <p className="text-xs rounded-lg bg-[#fde89e] font-medium px-2 py-1.5">
                  {(responseData?.role[0] ?? "") +
                    responseData?.role.slice(1).toLowerCase()}
                </p>
              </div>

              {/* Community settings */}
              <div className="md:flex hidden gap-4 items-center">
                {responseData?.role === "ADMIN" ? (
                  <>
                    <ButtonV2
                      variant="primary"
                      size="md"
                      onClick={() => setPopup("edit")}
                      className="text-xs"
                    >
                      Edit community
                    </ButtonV2>
                    <ButtonV2
                      variant="primary"
                      size="md"
                      onClick={() => setPopup("delete")}
                      className="text-xs"
                    >
                      Delete community
                    </ButtonV2>
                  </>
                ) : (
                  <ButtonV2
                    variant="primary"
                    size="md"
                    onClick={() => setPopup("exit")}
                    className="text-xs"
                  >
                    Exit community
                  </ButtonV2>
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
                    <ButtonV2
                      variant="primary"
                      size="md"
                      onClick={() => setPopup("edit")}
                      className="text-xs"
                    >
                      Edit community
                    </ButtonV2>
                    <ButtonV2
                      variant="primary"
                      size="md"
                      onClick={() => setPopup("delete")}
                      className="text-xs"
                    >
                      Delete community
                    </ButtonV2>
                  </>
                ) : (
                  <ButtonV2
                    variant="primary"
                    size="md"
                    onClick={() => setPopup("exit")}
                    className="text-xs"
                  >
                    Exit community
                  </ButtonV2>
                )}
              </div>
            )}

            {/* Community ID */}
            {responseData?.role === "ADMIN" ? (
              <div className="flex items-center justify-between gap-2 mt-3">
                <span className="text-sm md:text-normal">CommunityID:</span>
                <span className="text-xs bg-sky- px-2 py-1.5 rounded-lg border border-gray-200">
                  {responseData?.id}
                </span>
              </div>
            ) : (
              <p className="text-sm">{responseData?.description}</p>
            )}
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-2 mt-2">
            {/*Create new post box*/}
            <div className="border border-gray-200 bg-white shadow-xs rounded-xl px-8 py-4 space-y-4">
              <div className="flex gap-2">
                <InputBox
                  reference={newPostRef}
                  type="text"
                  size="none"
                  placeholder="Create a new post..."
                  fullWidth={true}
                  borderNone={true}
                />
                <ButtonV2
                  variant="primary"
                  size="md"
                  onClick={handleCreatePost}
                >
                  Post
                </ButtonV2>
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
                    createdAt={p.createdAt}
                    isLiked={p.isLiked ?? false}
                    onClickLike={() => toggleLike({ postId: p.id, index })}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {popup === "exit" && (
        <ExitCommunityCard setPopup={setPopup} communityId={responseData?.id} />
      )}

      {popup === "edit" && (
        <EditCommunityCard
          communityId={responseData?.id}
          setPopup={setPopup}
          fetchCommunityDetail={fetchCommunityDetail}
          communitName={responseData?.name}
          communitDesc={responseData?.description}
        />
      )}

      {popup === "delete" && (
        <DeleteCommunityCard
          setPopup={setPopup}
          communityId={responseData?.id}
        />
      )}
    </div>
  );
}
