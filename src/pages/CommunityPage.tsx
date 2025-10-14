import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoSendOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";


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
  isAnouncement: boolean;
  createdAt: string;
  likes: Like[];
  likedByUser: boolean;
}

interface Like {
  id: string;
  likedById: string;
}

interface Author {
  name: string;
  avatar: string;
}



const CommunityPage = () => {
  const { slug } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAnouncement, setIsAnouncement] = useState(false);


  const fetchCommunityDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/communities/${slug}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setCommunity(data);
      console.log("fetching community posts...")
    } catch (err) {
      console.error("Error fetching community:", err);
    } finally {
      setLoading(false);
      checkIsAdmin();
    }
  };

  const checkIsAdmin = async () => {
    try {
      const response: any = await fetch(`http://localhost:5000/api/communities/${slug}/isadmin`, {
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


  // always fetching the communities
  useEffect(() => {
    fetchCommunityDetails();
  }, [slug]);   

  

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      alert("Post cant be empty!");
      return;
    }
    setCreating(true);

    const response = await fetch(`http://localhost:5000/api/communities/${slug}`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, isAnonymous, isAnouncement }),
    });

    if (response.ok) {
      await fetchCommunityDetails();
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Something is wrong.");
    }

    setCreating(false);
    setContent("")
  }


  const handleClickLike = async (postId: string) => {
    setCommunity(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: prev.posts.map(post => {
          if (post.id === postId) {
            const alreadyLiked = post.likedByUser;
            const likeCount = post.likes.length;
            return {
              ...post,
              likedByUser: !alreadyLiked,
              likes: alreadyLiked
                ? post.likes.slice(0, likeCount - 1)
                : [...post.likes, { id: "temp", likedById: "temp" }],
            };
          }
          return post;
        })
      }
    });
    await fetch(`http://localhost:5000/api/communities/posts/${postId}/like`, {
      method: 'POST',
      credentials: "include",
    });
    console.log("updating likes...")
  };



  if (loading) {
    return <h1>Loading...</h1>
  }


  return (
    <div className="min-h-screen w-full flex flex-col justify- items-center bg-gray-100 lg:text-md px-4">
      <Sidebar />
      <h1 className="mt-24 mb-2 text-4xl font-medium">
        {community && community.name.charAt(0).toUpperCase() + community.name.slice(1)}
      </h1>


      <div className="h-full w-full flex flex-col justify-start items-center pt-5 gap-5 text-sm pb-40">

        {community?.posts.map((p: Post) => (
          <div 
            key={p.id} 
            className={`bg-white lg:w-[44%] w-full rounded-xl shadow px-6 py-4 space-y-3 border border-gray-100 ${p.isAnouncement ? "text-red-500 bg-pink-500 italic" : "text-gray-900"} `}>

            <div className="flex items-center gap-1.5">
              {p.anonymous ? 
              <p className="px-2.5 py-1 rounded-full bg-black text-white">?</p> : 
              <img 
                src={`http://localhost:5000/proxy-image?url=${encodeURIComponent(p.author.avatar)}`} 
                alt="pic" 
                className="mt- w-8 rounded-full " 
              />}
              <p className="font-medium">
                {p.anonymous ? "Anonymous" : p.author?.name}
              </p>
            </div>

            <p className="mt-4 px-2.5">
              {p.content}
            </p>
            <div className="px-2.5">
              <button
                onClick={() => handleClickLike(p.id)}
                className={`${p.likedByUser ? 'text-red-500 heart-pop' : 'text-gray-900'} flex items-center gap-1 cursor-pointer`}
              >
                {!p.likedByUser ? <FaRegHeart size={14} /> : <FaHeart size={14} />} {p.likes.length}
              </button>
            </div>
          </div>
        ))}


        {/* Post creation */}
        <div className="fixed bottom-4 bg-white lg:w-[44%] w-full border border-gray-300 rounded-2xl shadow-lg px-4 py-5 ">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsAnonymous(!isAnonymous)} 
              className={`${isAnonymous ? "bg-blue-500 text-white" : ""} border border-gray-400 rounded-lg px-2 flex items-center gap-0.5 text-gray-800 mb-3 ml-2`}>
              {isAnonymous ? <RxCrossCircled size={16} /> : null}
              Anonymous
            </button>
            <button
              onClick={() => setIsAnouncement(!isAnouncement)} 
              className={`${isAnouncement ? "bg-blue-500 text-white" : ""} border border-gray-400 rounded-lg px-2 flex items-center gap-0.5 text-gray-800 mb-3 ml-2`}>
              {isAnouncement ? <RxCrossCircled size={16} /> : null}
              Anouncement
            </button>
          </div>
          <div className="flex items-center justify-center">
            <input
            type="text"
            placeholder="write a post..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-l-full px-3 py-3"
            required
          />
          <button
            onClick={handleCreatePost}
            className="bg-black text-white px-5 py-3 rounded-r-full font-medium text-md w-fit cursor-pointer border border-black flex items-center gap-1.5"
          >
            {creating ? 'Posting...' : 'Post'} <IoSendOutline color="white" />
          </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CommunityPage