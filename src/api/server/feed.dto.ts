import type {
  FeedSort,
  PostComment,
  PostItem,
  PostMediaType,
  PostPoll,
  ReactionType,
} from '@Types/postTypes';

export type PostCommentDto = PostComment;

export type PostPollDto = PostPoll;

export type PostItemDto = {
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
  comments: PostCommentDto[];
  hashtags: string[];
  poll?: PostPollDto;
  createdAt: string;
};

export type FeedResponseDto = {
  items: PostItemDto[];
  sort: FeedSort;
};
