import Like from "../icons/Like";

interface PostCardProps {
  author: string;
  avatar: string;
  content: string;
  likeCount: number;
  createdAt: Date;
  isLiked: boolean;
  onClickLike?: () => void;
}

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function PostCard({
  author,
  avatar,
  content,
  likeCount,
  createdAt,
  isLiked,
  onClickLike,
}: PostCardProps) {
  return (
    <div className="bg-white px-8 py-8 flex flex-col gap-7 border border-gray-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={avatar}
            alt="image"
            className="w-12 h-12 border border-gray-300 rounded-full object-cover"
          />
          <p className="font-medium tracking-tight">{author}</p>

          <p className="md:block hidden text-sm text-sky-600">
            {formatDate(createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm pl-1 pt-1">
          <button onClick={onClickLike} className="flex items-center gap-0.5">
            {isLiked ? <Like fill="red" /> : <Like fill="none" />}
            {likeCount}
          </button>
        </div>
      </div>

      <p className="text-gray-800 pl-1 text-lg tracking-">{content}</p>
      <p className="md:hidden block text-sx text-sky-600">
        {formatDate(createdAt)}
      </p>
    </div>
  );
}
