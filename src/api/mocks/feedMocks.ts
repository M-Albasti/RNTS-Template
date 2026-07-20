import type MockAdapter from 'axios-mock-adapter';

import type {FeedResponseDto} from '@api/server/feed.dto';
import type {FeedSort} from '@Types/postTypes';

const SAMPLE_FILE = 'https://samplefile.com';

/** Richer social feed with image, audio, video, text, and poll posts from dummy media. */
const feedItems: FeedResponseDto['items'] = [
  {
    id: '1',
    author: 'Mahmoud',
    avatar: 'https://i.pravatar.cc/150?u=mahmoud',
    content: 'Welcome to the RNTS social feed — share photos, clips, and polls. #welcome #rnts',
    mediaType: 'text',
    likes: 42,
    likedByMe: false,
    myReaction: null,
    shares: 6,
    comments: [
      {
        id: 'c0',
        author: 'Nora',
        text: 'Excited to try this!',
        createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      },
    ],
    hashtags: ['welcome', 'rnts'],
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: '2',
    author: 'Sara',
    avatar: 'https://i.pravatar.cc/150?u=sara',
    content: 'Golden hour from the rooftop. #travel #photography',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/seed/rooftop/900/600',
    likes: 128,
    likedByMe: true,
    myReaction: 'love',
    shares: 18,
    comments: [
      {
        id: 'c1',
        author: 'Ali',
        text: 'Beautiful shot!',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: 'c2',
        author: 'Lina',
        text: 'Where is this?',
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ],
    hashtags: ['travel', 'photography'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    author: 'Ali',
    avatar: 'https://i.pravatar.cc/150?u=ali',
    content: 'New track drop — morning loop for focus sessions. #music #lofi',
    mediaType: 'audio',
    mediaUrl: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_music_loop_sample.mp3`,
    likes: 56,
    likedByMe: false,
    myReaction: null,
    shares: 9,
    comments: [],
    hashtags: ['music', 'lofi'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '4',
    author: 'Maya',
    avatar: 'https://i.pravatar.cc/150?u=maya',
    content: 'Weekend reel from downtown — swipe into the video player. #video #city',
    mediaType: 'video',
    mediaUrl: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_15s_sample_file_868KB.mp4`,
    likes: 203,
    likedByMe: false,
    myReaction: null,
    shares: 31,
    comments: [
      {
        id: 'c3',
        author: 'Omar',
        text: 'The color grade is 🔥',
        createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
    ],
    hashtags: ['video', 'city'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '5',
    author: 'Team RNTS',
    avatar: 'https://i.pravatar.cc/150?u=team',
    content: 'Which feature should we ship next?',
    mediaType: 'poll',
    likes: 77,
    likedByMe: false,
    myReaction: null,
    shares: 12,
    comments: [],
    hashtags: ['poll', 'product'],
    poll: {
      options: [
        {id: 'o1', text: 'Video calls in chat', votes: 34},
        {id: 'o2', text: 'Wallet QR pay', votes: 51},
        {id: 'o3', text: 'Gallery slideshow', votes: 22},
      ],
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '6',
    author: 'Jordan',
    avatar: 'https://i.pravatar.cc/150?u=jordan',
    content: 'Quick voice memo from the studio. #audio #voice',
    mediaType: 'audio',
    mediaUrl: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_voice_note_sample.mp3`,
    likes: 19,
    likedByMe: false,
    myReaction: null,
    shares: 2,
    comments: [],
    hashtags: ['audio', 'voice'],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '7',
    author: 'Elena',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    content: 'HD showcase clip for the media module. #video #demo',
    mediaType: 'video',
    mediaUrl: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_h264_aac_720p_sample.mp4`,
    likes: 91,
    likedByMe: true,
    myReaction: 'like',
    shares: 14,
    comments: [],
    hashtags: ['video', 'demo'],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '8',
    author: 'Chris',
    avatar: 'https://i.pravatar.cc/150?u=chris',
    content: 'Trail run this morning — the light was unreal. #fitness #outdoors',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/seed/trailrun/900/700',
    likes: 64,
    likedByMe: false,
    myReaction: null,
    shares: 7,
    comments: [],
    hashtags: ['fitness', 'outdoors'],
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
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
