import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {PostComment, PostItem, ReactionType, FeedSort} from '@Types/postTypes';

const extractHashtags = (content: string): string[] => {
  const matches = content.match(/#[\w]+/g);
  return matches ? matches.map(t => t.slice(1).toLowerCase()) : [];
};

const seedPosts: PostItem[] = [
  {
    id: '1',
    author: 'Mahmoud',
    avatar: 'https://i.pravatar.cc/100?u=1',
    content: 'Welcome to RNTS social feed! #welcome #rnts',
    mediaType: 'text',
    likes: 12,
    likedByMe: false,
    myReaction: null,
    shares: 3,
    comments: [],
    hashtags: ['welcome', 'rnts'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    author: 'Sara',
    avatar: 'https://i.pravatar.cc/100?u=2',
    content: 'Sunset from the beach today. #travel #photography',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/seed/beach/800/500',
    likes: 34,
    likedByMe: true,
    myReaction: 'love',
    shares: 8,
    comments: [
      {id: 'c1', author: 'Ali', text: 'Beautiful shot!', createdAt: new Date().toISOString()},
    ],
    hashtags: ['travel', 'photography'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    author: 'Ali',
    avatar: 'https://i.pravatar.cc/100?u=3',
    content: 'New audio track uploaded. #music',
    mediaType: 'audio',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    likes: 8,
    likedByMe: false,
    myReaction: null,
    shares: 1,
    comments: [],
    hashtags: ['music'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    author: 'Team RNTS',
    avatar: 'https://i.pravatar.cc/100?u=8',
    content: 'Which feature should we ship next?',
    mediaType: 'poll',
    likes: 5,
    likedByMe: false,
    myReaction: null,
    shares: 2,
    comments: [],
    hashtags: ['poll'],
    poll: {
      options: [
        {id: 'o1', text: 'Video calls in chat', votes: 14},
        {id: 'o2', text: 'Wallet QR pay', votes: 22},
        {id: 'o3', text: 'Gallery slideshow', votes: 9},
      ],
    },
    createdAt: new Date().toISOString(),
  },
];

export type PostsState = {
  posts: PostItem[];
  savedIds: string[];
  searchQuery: string;
  feedSort: FeedSort;
};

const initialState: PostsState = {
  posts: seedPosts,
  savedIds: ['2'],
  searchQuery: '',
  feedSort: 'recent',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.likedByMe = !post.likedByMe;
        post.myReaction = post.likedByMe ? 'like' : null;
        post.likes += post.likedByMe ? 1 : -1;
      }
    },
    setReaction: (
      state,
      action: PayloadAction<{postId: string; reaction: ReactionType}>,
    ) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (!post) return;
      const same = post.myReaction === action.payload.reaction;
      if (post.myReaction) post.likes -= 1;
      if (same) {
        post.myReaction = null;
        post.likedByMe = false;
      } else {
        post.myReaction = action.payload.reaction;
        post.likedByMe = true;
        post.likes += 1;
      }
    },
    sharePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.shares += 1;
    },
    votePoll: (
      state,
      action: PayloadAction<{postId: string; optionId: string}>,
    ) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (!post?.poll) return;
      if (post.poll.votedOptionId) {
        const prev = post.poll.options.find(o => o.id === post.poll?.votedOptionId);
        if (prev) prev.votes -= 1;
      }
      const option = post.poll.options.find(o => o.id === action.payload.optionId);
      if (option) option.votes += 1;
      post.poll.votedOptionId = action.payload.optionId;
    },
    setFeedSort: (state, action: PayloadAction<FeedSort>) => {
      state.feedSort = action.payload;
    },
    toggleSave: (state, action: PayloadAction<string>) => {
      const idx = state.savedIds.indexOf(action.payload);
      if (idx >= 0) state.savedIds.splice(idx, 1);
      else state.savedIds.push(action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addComment: (
      state,
      action: PayloadAction<{postId: string; comment: PostComment}>,
    ) => {
      state.posts.find(p => p.id === action.payload.postId)?.comments.push(action.payload.comment);
    },
    addPost: (state, action: PayloadAction<PostItem>) => {
      state.posts.unshift(action.payload);
    },
  },
});

export const {
  toggleLike,
  setReaction,
  sharePost,
  votePoll,
  setFeedSort,
  toggleSave,
  setSearchQuery,
  addComment,
  addPost,
} = postsSlice.actions;
export default postsSlice.reducer;

export {extractHashtags};
