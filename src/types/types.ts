export interface EditCommunityProps {
  setPopup: React.Dispatch<
    React.SetStateAction<"edit" | "delete" | "exit" | null>
  >;
  communityId?: string;
  communitName?: string;
  communitDesc?: string;
  fetchCommunityDetail: () => Promise<void>;
}

export interface ExitCommunityProps {
  setPopup: React.Dispatch<
    React.SetStateAction<"edit" | "delete" | "exit" | null>
  >;
  communityId?: string;
}

export interface CommunityPageResponseData {
  id: number;
  name: string;
  description: string;
  members: {
    role: "ADMIN" | "MEMBER";
  }[];
  posts: {
    id?: number;
    content: string;
    author: {
      username: string;
      avatar: string;
    };
    comments: {
      id: number;
    }[];
    likes: {
      id: number;
    }[];
    createdAt: Date;
  }[];
}

export interface CommunityWithRole {
  role: string;
  community: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
}

export interface CommunityDetails {
  id: string;
  name: string;
  description: string;
  posts: Post[];
  role: string;
}

export interface Post {
  id: number;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Date;
  likeCount: number;
  commentCount?: number;
  isLiked?: boolean;
}

export interface ProfileData {
  username: string;
  email: string;
  avatar: string;
  description: string;
}
