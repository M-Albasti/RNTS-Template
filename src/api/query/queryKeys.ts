import type {FeedSort} from '@Types/postTypes';

export const queryKeys = {
  all: ['api'] as const,
  dashboard: () => [...queryKeys.all, 'dashboard', 'stats'] as const,
  feed: (sort: FeedSort = 'recent') =>
    [...queryKeys.all, 'feed', sort] as const,
  auth: {
    session: () => [...queryKeys.all, 'auth', 'session'] as const,
  },
  wordPuzzle: {
    books: (language: string) => [...queryKeys.all, 'wordPuzzle', 'books', language] as const,
    book: (bookId: string) => [...queryKeys.all, 'wordPuzzle', 'book', bookId] as const,
    stageSummaries: (bookId: string) =>
      [...queryKeys.all, 'wordPuzzle', 'stages', bookId, 'summary'] as const,
    stage: (bookId: string, stageId: string) =>
      [...queryKeys.all, 'wordPuzzle', 'stage', bookId, stageId] as const,
  },
} as const;
