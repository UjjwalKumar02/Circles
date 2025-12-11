interface PostCardProps {
  author: string;
  avatar: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export default function PostCard({
  author,
  avatar,
  content,
  likeCount,
  commentCount,
  createdAt,
}: PostCardProps) {
  return (
    <div className="p-6 flex flex-col gap-9 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="border border-gray-200 rounded-full px-2.5 py-1 font-bold text-white">
          {avatar}
        </p>
        <p className="text-sm font-medium tracking-tight">
          {author}
        </p>
        </div>

        <p className="text-sm ">{createdAt}</p>
      </div>

      <p className="text-gray-900 pl-1">{content}</p>

      <div className="flex items-center gap-18 text-sm pl-1">
        <p>L {likeCount}</p>
        <p>C {commentCount}</p>
      </div>
    </div>
  );
}
