import type {AdhkarLanguage} from '@Types/islamicTypes';
import type {FeedSort} from '@Types/postTypes';
import type {HadithCollectionFilter} from '@api/clients/hadithClient';

export const queryKeys = {
  all: ['api'] as const,
  dashboard: () => [...queryKeys.all, 'dashboard', 'stats'] as const,
  feed: (sort: FeedSort = 'recent') =>
    [...queryKeys.all, 'feed', sort] as const,
  auth: {
    session: () => [...queryKeys.all, 'auth', 'session'] as const,
  },
  islamic: {
    quranSurahs: () => [...queryKeys.all, 'islamic', 'quran', 'surahs'] as const,
    quranSurah: (surahNumber: number) =>
      [...queryKeys.all, 'islamic', 'quran', 'surah', surahNumber] as const,
    quranSearch: (query: string) =>
      [...queryKeys.all, 'islamic', 'quran', 'search', query] as const,
    adhkarCategories: (lang: AdhkarLanguage) =>
      [...queryKeys.all, 'islamic', 'adhkar', 'categories', lang] as const,
    adhkarCategory: (categoryId: number, lang: AdhkarLanguage) =>
      [...queryKeys.all, 'islamic', 'adhkar', 'category', categoryId, lang] as const,
    hadithEditions: () => [...queryKeys.all, 'islamic', 'hadith', 'editions'] as const,
    hadithBooks: (slug: string) =>
      [...queryKeys.all, 'islamic', 'hadith', 'books', slug] as const,
    hadithList: (slug: string, page: number) =>
      [...queryKeys.all, 'islamic', 'hadith', 'list', slug, page] as const,
    hadithDetail: (id: string) =>
      [...queryKeys.all, 'islamic', 'hadith', 'detail', id] as const,
    hadithSearch: (query: string, filter: HadithCollectionFilter) =>
      [...queryKeys.all, 'islamic', 'hadith', 'search', query, filter] as const,
    prayerTimings: (city: string, country: string) =>
      [...queryKeys.all, 'islamic', 'prayer', city, country] as const,
  },
} as const;
