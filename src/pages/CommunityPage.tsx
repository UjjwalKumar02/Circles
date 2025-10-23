import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoSendOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { CiAt } from "react-icons/ci";
import { GoReply } from "react-icons/go";
import Navbar from "../components/Navbar";
import { IoMdAdd } from "react-icons/io";
import { LuRefreshCw } from "react-icons/lu";
import { io } from "socket.io-client";


interface Community {
  id: string;
  name: string;
  slug: string;
  posts: Post[];
}

interface Post {
  id: string;
  content: string;
  author: Author;
  anonymous: boolean;
  isAnnouncement: boolean;
  createdAt: string;
  likes: Like[];
  likedByUser: boolean;
}

interface Like {
  id: string;
  likedById: string;
}

interface Author {
  username: string,
  name: string;
  avatar: string;
}



const CommunityPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { slug } = useParams();

  const [community, setCommunity] = useState<Community | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const socket = io(backendUrl, { withCredentials: true });

    if (community?.id) {
      socket.emit("join_community", community.id);
    }

    socket.on("new_post", (post) => {
      console.log("New post recieved via socket:", post);
      setCommunity((prev) => {
        if (!prev) return prev;
        return { ...prev, posts: [post, ...prev.posts] };
      });
    });


    socket.on("update_like", (updatedPost) => {
      console.log("Like updated:", updatedPost);
      setCommunity((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          posts: prev.posts.map((p) =>
            p.id === updatedPost.id
              ? {
                ...p,
                likes: updatedPost.likes,
                likedByUser: updatedPost.likedByUser ?? p.likedByUser,
              }
              : p
          ),
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [community?.id, backendUrl]);



  const fetchCommunityDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/communities/${slug}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setCommunity(data);
      console.log("fetching community posts...")
      console.log(data);
    } catch (err) {
      console.error("Error fetching community:", err);
    } finally {
      setLoading(false);
      checkIsAdmin();
    }
  };

  const checkIsAdmin = async () => {
    try {
      const response: any = await fetch(`${backendUrl}/api/communities/${slug}/isadmin`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setIsAdmin(data.isAdmin);
      console.log(data);
    } catch (error) {
      console.log("error in checking admin");
    }
  }


  useEffect(() => {
    fetchCommunityDetails();
  }, [slug]);



  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      alert("Post cant be empty!");
      return;
    }
    setLoading(true);

    const response = await fetch(`${backendUrl}/api/communities/${slug}`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, isAnonymous, isAnnouncement }),
    });

    if (response.ok) {
      await fetchCommunityDetails();
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Something is wrong.");
    }

    setLoading(false);
    setContent("");
    setIsAnonymous(false);
    setIsAnnouncement(false);
    setShowCreate(false);
  }


  // const handleClickLike = async (postId: string) => {
  //   setCommunity(prev => {
  //     if (!prev) return prev;
  //     return {
  //       ...prev,
  //       posts: prev.posts.map(post => {
  //         if (post.id === postId) {
  //           const alreadyLiked = post.likedByUser;
  //           const likeCount = post.likes.length;
  //           return {
  //             ...post,
  //             likedByUser: !alreadyLiked,
  //             likes: alreadyLiked
  //               ? post.likes.slice(0, likeCount - 1)
  //               : [...post.likes, { id: "temp", likedById: "temp" }],
  //           };
  //         }
  //         return post;
  //       })
  //     }
  //   });
  //   await fetch(`${backendUrl}/api/communities/posts/${postId}/like`, {
  //     method: 'POST',
  //     credentials: "include",
  //   });
  //   console.log("updating likes...")
  // };


  // const handleClickLike = async (postId: string) => {
  //   // Optimistically update UI
  //   setCommunity((prev) => {
  //     if (!prev) return prev;
  //     return {
  //       ...prev,
  //       posts: prev.posts.map((p) => {
  //         if (p.id !== postId) return p;
  //         const alreadyLiked = p.likedByUser;
  //         return {
  //           ...p,
  //           likedByUser: !alreadyLiked,
  //           likes: alreadyLiked
  //             ? p.likes.slice(0, -1)
  //             : [...p.likes, { id: "temp", likedById: "temp" }],
  //         };
  //       }),
  //     };
  //   });

  //   try {
  //     const response = await fetch(`${backendUrl}/api/communities/posts/${postId}/like`, {
  //       method: "POST",
  //       credentials: "include",
  //     });

  //     if (!response.ok) throw new Error("Failed to toggle like");
  //   } catch (err) {
  //     console.error("Error toggling like:", err);
  //     // revert optimistic update on error
  //     setCommunity((prev) => {
  //       if (!prev) return prev;
  //       return {
  //         ...prev,
  //         posts: prev.posts.map((p) => {
  //           if (p.id !== postId) return p;
  //           const alreadyLiked = !p.likedByUser; // reverse it
  //           return {
  //             ...p,
  //             likedByUser: alreadyLiked,
  //             likes: alreadyLiked
  //               ? [...p.likes, { id: "temp", likedById: "temp" }]
  //               : p.likes.slice(0, -1),
  //           };
  //         }),
  //       };
  //     });
  //   }
  // };



  const handleClickLike = async (postId: string) => {
    setCommunity((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: prev.posts.map((p) => {
          if (p.id !== postId) return p;
          const alreadyLiked = p.likedByUser;
          const currentLikes = p.likes ?? []; // ✅ safeguard
          return {
            ...p,
            likedByUser: !alreadyLiked,
            likes: alreadyLiked
              ? currentLikes.slice(0, -1)
              : [...currentLikes, { id: "temp", likedById: "temp" }],
          };
        }),
      };
    });

    try {
      const res = await fetch(`${backendUrl}/api/communities/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle like");
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };



  const handleReply = (username: string) => {
    setContent("@" + username + " ");
  };




  return (
    <div className="min-h-screen w-full flex flex-col lg:text-md">
      <Navbar loading={loading} />

      <div className="flex justify-center lg:gap-6">
        <Sidebar />

        <div className="flex flex-col justify-start items-center lg:mt-5 mt-0 text-sm lg:w-[42%] w-full border-b-[1.5px] border-gray-300">

          <div className="w-full flex justify-between items-center bg-[#f6f8fa] text-[#1f2328] px-5.5 py-3.5 border-x-[1.5px] border-y-[1.5px] border-x-gray-300 border-t-gray-300 border-b-gray-200 lg:rounded-t-2xl shadow-xs">


            <h2 className="lg:block hidden font-medium text-lg py-0.5">
              {community && community.name.charAt(0).toUpperCase() + community.name.slice(1)}
            </h2>

            <button
              onClick={() => fetchCommunityDetails()}
              className="lg:hidden py-1 cursor-pointer font-medium text-lg flex gap-1.5 items-center"
            >
              {community && community.name.charAt(0).toUpperCase() + community.name.slice(1)}
              <LuRefreshCw size={18} color="" />
            </button>

            <div className="flex items-center">
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="lg:hidden block px-1 py-1 rounded-full  cursor-pointer"
              >
                <IoMdAdd size={24} color="black" />
              </button>

            </div>
          </div>

          {community?.posts.map((p: Post) => (
            <div
              key={p.id}
              className={`w-full px-7.5 py-4.5 flex flex-col gap-6.5 justify-center shadow-xs border-x-[1.5px] border-t-[1.5px] border-x-gray-300 border-gray-300  ${p.isAnnouncement ? "text-[#0969da] font-medium" : "text-[#1f2328]"} `}>

              <div className="flex items-center gap-2.5">
                {p.anonymous ?
                  <p className="px-4 py-2.5 rounded-full bg-black text-white">-</p> :
                  <img
                    src={`${backendUrl}/proxy-image?url=${encodeURIComponent(p.author.avatar)}`}
                    alt="pic"
                    className="w-10 rounded-full "
                  />}

                <div className="flex gap-2 items-center">
                  <p className="font-medium text-[#1f2328]">
                    {p.anonymous ? "Anonymous" : p.author?.name}
                  </p>
                  <p className="flex items-center text-xs text-[#0969da] border-[1.5px] rounded-full px-1.5 py-0.5 font-medium">
                    <CiAt size={15} />{p.anonymous ? "anonymous" : p.author?.username}
                  </p>
                </div>
              </div>

              <p className="text-[1rem]">
                {p.content}
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleClickLike(p.id)}
                  className={`${p.likedByUser ? 'text-[#0969da] heart-pop' : 'text-[#1f2328]'} flex items-center gap-1 cursor-pointer`}
                >
                  {!p.likedByUser ? <FaRegHeart size={16} /> : <FaHeart size={16} />} {p.likes?.length}
                </button>

                <button
                  onClick={() => { setShowCreate(true); handleReply(p.anonymous ? "anonymous" : p.author.username) }}
                  className={` flex items-center gap-1 cursor-pointer text-[#1f2328]`}
                >
                  <GoReply size={18} />
                </button>
              </div>
            </div>
          ))}

        </div>


        <div>
          <div className="hidden sticky top-19 h-fit mt-5 text-[#1f2328] shadow-xs border-[1.5px] border-gray-300 px-9 lg:flex flex-col items-center py-10 gap-4 rounded-2xl">
            <p>
              Create a
              <br />
              new post
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-[#f6f8fa] text-[#1f2328] text-sm px-7 py-1 rounded-full font-medium cursor-pointer border-[1.5px] border-gray-300 shadow-xs"
            >
              Create
            </button>
          </div>

          <div className="hidden sticky top-70 h-fit mt-5 text-[#1f2328] shadow-xs border-[1.5px] border-gray-300 px-9 lg:flex flex-col items-center py-10 gap-4 rounded-2xl text-center">
            <p>
              Load
              <br />
              new posts
            </p>
            <button
              onClick={() => fetchCommunityDetails()}
              className="bg-[#f6f8fa] text-[#1f2328] text-sm px-7 py-1 rounded-full font-medium cursor-pointer border-[1.5px] border-gray-300 shadow-xs"
            >
              Load
            </button>
          </div>
        </div>


        {showCreate && (
          <div className="fixed inset-0 bg-black/10 flex items-center justify-center text-[#1f2328]">

            <div className="bg-white md:px-12 px-9 py-9 rounded-2xl shadow flex flex-col gap-4 justify-center">

              <h1 className="text-xl text-center font-medium md:mb-4 mb-1">
                Write a new post
              </h1>

              <form
                onSubmit={handleCreatePost}
                className="flex items-center justify-center"
              >
                <input
                  type="text"
                  placeholder=""
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-l-xl px-2 py-2.5 text-sm bg-blue-50 lg:min-w-80"
                  required
                />
                <button
                  type="submit"
                  className="w-fit px-3.5 py-2.5 bg-[#f6f8fa]  rounded-r-xl font-medium border-[1.5px] border-gray-300 cursor-pointer text-sm shadow-xs flex gap-1 items-center justify-center"
                >
                  Post
                  <IoSendOutline />
                </button>
              </form>

              <div className="flex items-center gap-2 mt- justify-between">

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`${isAnonymous ? "bg-[#f6f8fa]" : ""} py-0.5 px-3 border border-gray-300 rounded-full font- cursor-pointer text-sm flex items-center gap-1 justify-center`}>
                    {isAnonymous ? <RxCrossCircled size={16} /> : null}
                    Anonymous
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => setIsAnnouncement(!isAnnouncement)}
                      className={`${isAnnouncement ? "bg-[#f6f8fa]" : ""} py-0.5 px-3 border border-gray-300 rounded-full font- cursor-pointer text-sm flex items-center gap-1`}>
                      {isAnnouncement ? <RxCrossCircled size={16} /> : null}
                      Anouncement
                    </button>
                  )}
                </div>

                <button
                  onClick={() => { setShowCreate(false); setContent("") }}
                  className="bg-black text-white py-1 px-3 border border-gray-300 rounded-lg font-medium cursor-pointer text-sm lg:ml-14"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityPage