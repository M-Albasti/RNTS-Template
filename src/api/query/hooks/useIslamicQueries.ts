import {useInfiniteQuery, useQuery} from '@tanstack/react-query';

import {adhkarClient} from '@api/clients/adhkarClient';
import {
  HADITH_PAGE_SIZE,
  hadithClient,
  type HadithCollectionFilter,
} from '@api/clients/hadithClient';
import {mp3quranClient} from '@api/clients/mp3quranClient';
import {prayerClient} from '@api/clients/prayerClient';
import {quranClient} from '@api/clients/quranClient';
import {queryKeys} from '@api/query/queryKeys';
import type {AdhkarLanguage} from '@Types/islamicTypes';

export const useQuranSurahsQuery = () =>
  useQuery({
    queryKey: queryKeys.islamic.quranSurahs(),
    queryFn: () => quranClient.getSurahList(),
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useQuranSurahQuery = (
  surahNumber: number,
  tafsirEditionId = 'ar.muyassar',
  withTranslation = false,
) =>
  useQuery({
    queryKey: queryKeys.islamic.quranSurah(surahNumber, tafsirEditionId, withTranslation),
    queryFn: () => quranClient.getSurahReading(surahNumber, tafsirEditionId, withTranslation),
    enabled: surahNumber > 0,
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useQuranJuzListQuery = () =>
  useQuery({
    queryKey: queryKeys.islamic.quranJuzList(),
    queryFn: () => quranClient.getJuzList(),
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useQuranSurahNameSearchQuery = (query: string) =>
  useQuery({
    queryKey: queryKeys.islamic.quranSurahSearch(query),
    queryFn: () => quranClient.searchSurahByName(query),
    enabled: query.trim().length >= 1,
    staleTime: 1000 * 60 * 60,
  });

export const useQuranSearchQuery = (query: string, language = 'ar') =>
  useQuery({
    queryKey: queryKeys.islamic.quranSearch(query, language),
    queryFn: () => quranClient.searchQuranText(query, language),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
  });

export const useQuranMushafPageQuery = (pageNumber: number) =>
  useQuery({
    queryKey: queryKeys.islamic.quranMushafPage(pageNumber),
    queryFn: () => quranClient.getMushafPage(pageNumber),
    enabled: pageNumber >= 1 && pageNumber <= 604,
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useQuranPageForAyahQuery = (surahNumber: number, ayahNumber = 1) =>
  useQuery({
    queryKey: queryKeys.islamic.quranPageForAyah(surahNumber, ayahNumber),
    queryFn: () => quranClient.getPageForAyah(surahNumber, ayahNumber),
    enabled: surahNumber > 0,
    staleTime: 1000 * 60 * 60 * 24,
  });

/** Verse timestamps for continuous surah audio (mp3quran timing API). */
export const useQuranAyahTimingQuery = (surahNumber: number, readId: number | null) =>
  useQuery({
    queryKey: queryKeys.islamic.quranAyahTiming(surahNumber, readId ?? 0),
    queryFn: () => mp3quranClient.getSurahAyahTiming(surahNumber, readId as number),
    enabled: surahNumber > 0 && readId != null && readId > 0,
    staleTime: 1000 * 60 * 60 * 24,
  });

/** Ayah→mushaf page map used when reciter timing is missing. */
export const useQuranSurahAyahPagesQuery = (surahNumber: number, enabled = true) =>
  useQuery({
    queryKey: queryKeys.islamic.quranSurahAyahPages(surahNumber),
    queryFn: () => quranClient.getSurahAyahPages(surahNumber),
    enabled: enabled && surahNumber > 0,
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useAdhkarCategoriesQuery = (lang: AdhkarLanguage) =>
  useQuery({
    queryKey: queryKeys.islamic.adhkarCategories(lang),
    queryFn: () => adhkarClient.getCategories(lang),
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useAdhkarCategoryQuery = (categoryId: number, lang: AdhkarLanguage) =>
  useQuery({
    queryKey: queryKeys.islamic.adhkarCategory(categoryId, lang),
    queryFn: () => adhkarClient.getCategoryItems(categoryId, lang),
    enabled: categoryId > 0,
    staleTime: 1000 * 60 * 60 * 12,
  });

/** Full-text search across Hisn al-Muslim dhikr bodies + category titles. */
export const useAdhkarSearchQuery = (query: string, lang: AdhkarLanguage) =>
  useQuery({
    queryKey: queryKeys.islamic.adhkarSearch(query, lang),
    queryFn: () => adhkarClient.searchItems(query, lang),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 60 * 12,
    placeholderData: previous => previous,
  });

export const useHadithEditionsQuery = () =>
  useQuery({
    queryKey: queryKeys.islamic.hadithEditions(),
    queryFn: () => hadithClient.getEditions(),
    staleTime: 1000 * 60 * 60 * 24,
  });

export const useHadithBooksQuery = (slug: string) =>
  useQuery({
    queryKey: queryKeys.islamic.hadithBooks(slug),
    queryFn: () => hadithClient.getEditionBooks(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 60 * 12,
  });

export const useHadithListQuery = (slug: string, page: number, language = 'en') =>
  useQuery({
    queryKey: queryKeys.islamic.hadithList(slug, page, language),
    queryFn: () => hadithClient.getEditionHadiths(slug, page, language),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
    placeholderData: previous => previous,
    // 429 retries live in enqueueHadithRequest — avoid double backoff here.
    retry: (failureCount, error) => {
      const status = (error as {response?: {status?: number}})?.response?.status;
      if (status === 429) {
        return false;
      }
      return failureCount < 1;
    },
  });

/** Infinite hadith pages for FlashList onEndReached / Load more. */
export const useHadithListInfiniteQuery = (slug: string, language = 'en') =>
  useInfiniteQuery({
    queryKey: queryKeys.islamic.hadithListInfinite(slug, language),
    queryFn: ({pageParam}) =>
      hadithClient.getEditionHadiths(slug, pageParam as number, language),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const totalPages = Math.max(
        1,
        Math.ceil(lastPage.total / (lastPage.pageSize || HADITH_PAGE_SIZE)),
      );
      if (lastPage.page >= totalPages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
    // 429 retries live in enqueueHadithRequest — avoid double backoff here.
    retry: (failureCount, error) => {
      const status = (error as {response?: {status?: number}})?.response?.status;
      if (status === 429) {
        return false;
      }
      return failureCount < 1;
    },
  });

export const useHadithDetailQuery = (hadithId: string, language = 'en') =>
  useQuery({
    queryKey: queryKeys.islamic.hadithDetail(hadithId, language),
    queryFn: () => hadithClient.getHadithById(hadithId, language),
    enabled: Boolean(hadithId),
    staleTime: 1000 * 60 * 60,
  });

export const useHadithSearchQuery = (
  query: string,
  filter: HadithCollectionFilter = 'all',
  language = 'en',
  page = 1,
) =>
  useQuery({
    queryKey: queryKeys.islamic.hadithSearch(query, filter, language, page),
    queryFn: () => hadithClient.searchHadiths(query, filter, language, page),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 30,
    // 429 retries live in enqueueHadithRequest — avoid double backoff here.
    retry: (failureCount, error) => {
      const status = (error as {response?: {status?: number}})?.response?.status;
      if (status === 400 || status === 429) {
        return false;
      }
      return failureCount < 1;
    },
  });

export const usePrayerTimingsQuery = (
  city: string,
  country: string,
  date?: Date | null,
) => {
  const dateKey = date ? date.toISOString().slice(0, 10) : '';
  return useQuery({
    queryKey: queryKeys.islamic.prayerTimings(city, country, dateKey),
    queryFn: () => prayerClient.getTimingsByCity(city, country, 4, date ?? undefined),
    enabled: Boolean(city && country),
    staleTime: 1000 * 60 * 30,
  });
};

export const usePrayerTimingsByCoordsQuery = (
  latitude: number | null | undefined,
  longitude: number | null | undefined,
  timezone?: string | null,
  date?: Date | null,
) => {
  const dateKey = date ? date.toISOString().slice(0, 10) : '';
  return useQuery({
    queryKey: queryKeys.islamic.prayerTimingsCoords(
      latitude ?? 0,
      longitude ?? 0,
      timezone,
      dateKey,
    ),
    queryFn: () =>
      prayerClient.getTimingsByCoords(
        latitude as number,
        longitude as number,
        4,
        timezone ?? undefined,
        date ?? undefined,
      ),
    enabled:
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude),
    staleTime: 1000 * 60 * 30,
  });
};
