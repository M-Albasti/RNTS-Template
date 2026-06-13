import type MockAdapter from 'axios-mock-adapter';

import type {FeedResponseDto} from '@api/server/feed.dto';
import type {FeedSort} from '@Types/postTypes';

const feedItems: FeedResponseDto['items'] = [
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
      {
        id: 'c1',
        author: 'Ali',
        text: 'Beautiful shot!',
        createdAt: new Date().toISOString(),
      },
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

export const registerFeedMocks = (mock: MockAdapter): void => {
  mock.onGet('/feed').reply(config => {
    const sort = ((config.params?.sort as string) || 'recent') as FeedSort;
    const items = [...feedItems];

    if (sort === 'popular') {
      items.sort((a, b) => b.likes + b.shares - (a.likes + a.shares));
    } else {
      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return [200, {items, sort} satisfies FeedResponseDto];
  });
};
