export type PostMediaType = 'text' | 'image' | 'video' | 'audio' | 'poll';

export type ReactionType = 'like' | 'love' | 'wow' | 'sad';

export type PostComment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export type PostPoll = {
  options: PollOption[];
  votedOptionId?: string;
};

export type PostItem = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  mediaType: PostMediaType;
  mediaUrl?: string;
  likes: number;
  likedByMe: boolean;
  myReaction: ReactionType | null;
  shares: number;
  comments: PostComment[];
  hashtags: string[];
  poll?: PostPoll;
  createdAt: string;
};

export type FeedSort = 'recent' | 'popular';
