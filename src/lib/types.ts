
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  followerCount: number;
  followingCount: number;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}
