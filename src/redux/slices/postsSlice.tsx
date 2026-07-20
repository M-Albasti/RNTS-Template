import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {PostComment, PostItem, ReactionType, FeedSort} from '@Types/postTypes';

const extractHashtags = (content: string): string[] => {
  const matches = content.match(/#[\w]+/g);
  return matches ? matches.map(t => t.slice(1).toLowerCase()) : [];
};

const seedPosts: PostItem[] = [];

export type PostsState = {
  posts: PostItem[];
  savedIds: string[];
  searchQuery: string;
  feedSort: FeedSort;
};

const initialState: PostsState = {
  posts: seedPosts,
  savedIds: [],
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
    hydratePosts: (state, action: PayloadAction<PostItem[]>) => {
      state.posts = action.payload;
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
  hydratePosts,
} = postsSlice.actions;
export default postsSlice.reducer;

export {extractHashtags};
