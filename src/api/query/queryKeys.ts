import type {FeedSort} from '@Types/postTypes';

export const queryKeys = {
  all: ['api'] as const,
  dashboard: () => [...queryKeys.all, 'dashboard', 'stats'] as const,
  feed: (sort: FeedSort = 'recent') =>
    [...queryKeys.all, 'feed', sort] as const,
  auth: {
    session: () => [...queryKeys.all, 'auth', 'session'] as const,
  },
} as const;
