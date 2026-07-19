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
  wordPuzzle: {
    books: (language: string) => [...queryKeys.all, 'wordPuzzle', 'books', language] as const,
    book: (bookId: string) => [...queryKeys.all, 'wordPuzzle', 'book', bookId] as const,
    stageSummaries: (bookId: string) =>
      [...queryKeys.all, 'wordPuzzle', 'stages', bookId, 'summary'] as const,
    stage: (bookId: string, stageId: string) =>
      [...queryKeys.all, 'wordPuzzle', 'stage', bookId, stageId] as const,
  },
  islamic: {
    quranSurahs: () => [...queryKeys.all, 'islamic', 'quran', 'surahs'] as const,
    quranSurah: (surahNumber: number, tafsirEditionId: string, withTranslation = false) =>
      [
        ...queryKeys.all,
        'islamic',
        'quran',
        'surah',
        surahNumber,
        tafsirEditionId,
        withTranslation,
      ] as const,
    quranJuzList: () => [...queryKeys.all, 'islamic', 'quran', 'juz'] as const,
    quranSurahSearch: (query: string) =>
      [...queryKeys.all, 'islamic', 'quran', 'surah-search', query] as const,
    quranSearch: (query: string, language = 'ar') =>
      [...queryKeys.all, 'islamic', 'quran', 'search', query, language] as const,
    quranMushafPage: (page: number) =>
      [...queryKeys.all, 'islamic', 'quran', 'mushaf', page] as const,
    quranPageForAyah: (surah: number, ayah: number) =>
      [...queryKeys.all, 'islamic', 'quran', 'page-for', surah, ayah] as const,
    quranAyahTiming: (surah: number, readId: number) =>
      [...queryKeys.all, 'islamic', 'quran', 'ayah-timing', surah, readId] as const,
    quranSurahAyahPages: (surah: number) =>
      [...queryKeys.all, 'islamic', 'quran', 'ayah-pages', surah] as const,
    adhkarCategories: (lang: AdhkarLanguage) =>
      [...queryKeys.all, 'islamic', 'adhkar', 'categories', lang] as const,
    adhkarCategory: (categoryId: number, lang: AdhkarLanguage) =>
      [...queryKeys.all, 'islamic', 'adhkar', 'category', categoryId, lang] as const,
    adhkarSearch: (query: string, lang: AdhkarLanguage) =>
      [...queryKeys.all, 'islamic', 'adhkar', 'search', query, lang] as const,
    hadithEditions: () => [...queryKeys.all, 'islamic', 'hadith', 'editions'] as const,
    hadithBooks: (slug: string) =>
      [...queryKeys.all, 'islamic', 'hadith', 'books', slug] as const,
    hadithList: (slug: string, page: number, language: string) =>
      [...queryKeys.all, 'islamic', 'hadith', 'list', slug, page, language] as const,
    hadithListInfinite: (slug: string, language: string) =>
      [...queryKeys.all, 'islamic', 'hadith', 'list-infinite', slug, language] as const,
    hadithDetail: (id: string, language: string) =>
      [...queryKeys.all, 'islamic', 'hadith', 'detail', id, language] as const,
    hadithSearch: (
      query: string,
      filter: HadithCollectionFilter,
      language: string,
      page = 1,
    ) =>
      [...queryKeys.all, 'islamic', 'hadith', 'search', query, filter, language, page] as const,
    prayerTimings: (city: string, country: string, dateKey = '') =>
      [...queryKeys.all, 'islamic', 'prayer', 'city', city, country, dateKey] as const,
    prayerTimingsCoords: (
      lat: number,
      lng: number,
      timezone?: string | null,
      dateKey = '',
    ) =>
      [
        ...queryKeys.all,
        'islamic',
        'prayer',
        'coords',
        lat,
        lng,
        timezone ?? '',
        dateKey,
      ] as const,
  },
} as const;
