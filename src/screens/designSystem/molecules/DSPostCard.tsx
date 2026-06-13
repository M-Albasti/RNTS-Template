import React from 'react';
import {View} from 'react-native';

import PostCard from '@molecules/posts/PostCard';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const textPost = {
  id: 'ds-1',
  author: 'Mahmoud',
  avatar: 'https://i.pravatar.cc/100?u=1',
  content: 'Welcome to RNTS social feed! #welcome #rnts',
  mediaType: 'text' as const,
  likes: 12,
  likedByMe: false,
  myReaction: null,
  shares: 3,
  comments: [],
  hashtags: ['welcome', 'rnts'],
  createdAt: new Date().toISOString(),
};

const imagePost = {
  id: 'ds-2',
  author: 'Sara',
  avatar: 'https://i.pravatar.cc/100?u=2',
  content: 'Sunset from the beach today. #travel #photography',
  mediaType: 'image' as const,
  mediaUrl: 'https://picsum.photos/seed/beach/800/500',
  likes: 34,
  likedByMe: true,
  myReaction: 'love' as const,
  shares: 8,
  comments: [],
  hashtags: ['travel', 'photography'],
  createdAt: new Date().toISOString(),
};

const pollPost = {
  id: 'ds-5',
  author: 'Team RNTS',
  avatar: 'https://i.pravatar.cc/100?u=8',
  content: 'Which feature should we ship next?',
  mediaType: 'poll' as const,
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
};

const PostsSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <PostCard post={textPost} onPress={() => {}} onLike={() => {}} />
      <PostCard post={imagePost} onPress={() => {}} onLike={() => {}} saved />
      <PostCard post={pollPost} onPress={() => {}} onLike={() => {}} />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Post Card',
  subtitle: 'Text, image, and poll variants from posts seed structure.',
  sections: [{title: 'Post types', content: <PostsSection />}],
});
