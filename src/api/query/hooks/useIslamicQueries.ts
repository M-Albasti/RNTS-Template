import {useQuery} from '@tanstack/react-query';

import {adhkarClient} from '@api/clients/adhkarClient';
import {hadithClient, type HadithCollectionFilter} from '@api/clients/hadithClient';
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
    queryKey: queryKeys.islamic.quranSurah(surahNumber, tafsirEditionId),
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
  });

export const useQuranSearchQuery = (query: string, language = 'ar') =>
  useQuery({
    queryKey: queryKeys.islamic.quranSearch(query),
    queryFn: () => quranClient.searchQuranText(query, language),
    enabled: query.trim().length >= 2,
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

export const useAdhkarSearchQuery = (query: string, lang: AdhkarLanguage) =>
  useQuery({
    queryKey: queryKeys.islamic.adhkarSearch(query, lang),
    queryFn: () => adhkarClient.searchCategories(query, lang),
    enabled: query.trim().length >= 1,
    staleTime: 1000 * 60 * 60 * 12,
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
  });

export const useHadithDetailQuery = (hadithId: string, language = 'en') =>
  useQuery({
    queryKey: queryKeys.islamic.hadithDetail(hadithId, language),
    queryFn: () => hadithClient.getHadithById(hadithId, language),
    enabled: Boolean(hadithId),
  });

export const useHadithSearchQuery = (
  query: string,
  filter: HadithCollectionFilter = 'all',
  language = 'en',
) =>
  useQuery({
    queryKey: queryKeys.islamic.hadithSearch(query, filter, language),
    queryFn: () => hadithClient.searchHadiths(query, filter, language),
    enabled: query.trim().length >= 2,
  });

export const usePrayerTimingsQuery = (city: string, country: string) =>
  useQuery({
    queryKey: queryKeys.islamic.prayerTimings(city, country),
    queryFn: () => prayerClient.getTimingsByCity(city, country),
    enabled: Boolean(city && country),
    staleTime: 1000 * 60 * 30,
  });
