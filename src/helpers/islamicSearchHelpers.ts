import {load, remove, save} from '@redux/storage/mmkv';

export const ISLAMIC_SEARCH_HISTORY_KEY = 'islamic.search.history.v1';
export const MAX_SEARCH_HISTORY = 12;
export const SEARCH_DEBOUNCE_MS = 350;

export type IslamicSearchHistoryScope = 'all' | 'quran' | 'adhkar' | 'hadith';

export type IslamicSearchHistoryEntry = {
  query: string;
  scope?: IslamicSearchHistoryScope;
  at: number;
};

export type IslamicSearchSuggestion = {
  id: string;
  label: string;
  query: string;
  kind: 'recent' | 'surah' | 'adhkar' | 'hadith' | 'query';
  /** Optional deep-link targets for richer suggestion taps. */
  categoryId?: number;
  surahNumber?: number;
};

/** Popular surahs for idle suggestions (number + bilingual labels). */
export const POPULAR_SURAH_SUGGESTIONS: Array<{
  number: number;
  ar: string;
  en: string;
}> = [
  {number: 1, ar: 'الفاتحة', en: 'Al-Fatihah'},
  {number: 2, ar: 'البقرة', en: 'Al-Baqarah'},
  {number: 18, ar: 'الكهف', en: 'Al-Kahf'},
  {number: 36, ar: 'يس', en: 'Ya-Sin'},
  {number: 55, ar: 'الرحمن', en: 'Ar-Rahman'},
  {number: 67, ar: 'الملك', en: 'Al-Mulk'},
  {number: 112, ar: 'الإخلاص', en: 'Al-Ikhlas'},
  {number: 113, ar: 'الفلق', en: 'Al-Falaq'},
  {number: 114, ar: 'الناس', en: 'An-Nas'},
];

export const FEATURED_ADHKAR_SUGGESTIONS: Array<{
  id: number;
  titleKey: string;
  queryAr: string;
  queryEn: string;
}> = [
  {
    id: 27,
    titleKey: 'islamic.adhkar.morningEvening',
    queryAr: 'الصباح',
    queryEn: 'morning',
  },
  {
    id: 28,
    titleKey: 'islamic.adhkar.sleep',
    queryAr: 'النوم',
    queryEn: 'sleep',
  },
  {
    id: 25,
    titleKey: 'islamic.adhkar.afterPrayer',
    queryAr: 'بعد السلام',
    queryEn: 'after prayer',
  },
  {
    id: 96,
    titleKey: 'islamic.adhkar.travel',
    queryAr: 'السفر',
    queryEn: 'travel',
  },
];

export const FEATURED_HADITH_SUGGESTIONS: Array<{
  slug: string;
  queryAr: string;
  queryEn: string;
  labelAr: string;
  labelEn: string;
}> = [
  {
    slug: 'sahih-al-bukhari',
    queryAr: 'البخاري',
    queryEn: 'bukhari',
    labelAr: 'صحيح البخاري',
    labelEn: 'Sahih al-Bukhari',
  },
  {
    slug: 'sahih-muslim',
    queryAr: 'مسلم',
    queryEn: 'muslim',
    labelAr: 'صحيح مسلم',
    labelEn: 'Sahih Muslim',
  },
  {
    slug: 'forty-hadith-of-an-nawawi',
    queryAr: 'النووي',
    queryEn: 'nawawi',
    labelAr: 'الأربعون النووية',
    labelEn: 'Nawawi Forty',
  },
];

export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

export function loadSearchHistory(): IslamicSearchHistoryEntry[] {
  const stored = load<IslamicSearchHistoryEntry[]>(ISLAMIC_SEARCH_HISTORY_KEY);
  if (!Array.isArray(stored)) {
    return [];
  }
  return stored
    .filter(item => item && typeof item.query === 'string' && item.query.trim())
    .slice(0, MAX_SEARCH_HISTORY);
}

export function persistSearchQuery(
  query: string,
  scope?: IslamicSearchHistoryScope,
): IslamicSearchHistoryEntry[] {
  const normalized = normalizeSearchQuery(query);
  if (normalized.length < 1) {
    return loadSearchHistory();
  }

  const next: IslamicSearchHistoryEntry[] = [
    {query: normalized, scope, at: Date.now()},
    ...loadSearchHistory().filter(
      item => item.query.toLowerCase() !== normalized.toLowerCase(),
    ),
  ].slice(0, MAX_SEARCH_HISTORY);

  save(ISLAMIC_SEARCH_HISTORY_KEY, next);
  return next;
}

export function clearSearchHistory(): void {
  remove(ISLAMIC_SEARCH_HISTORY_KEY);
}

export function removeSearchHistoryEntry(query: string): IslamicSearchHistoryEntry[] {
  const normalized = normalizeSearchQuery(query).toLowerCase();
  const next = loadSearchHistory().filter(
    item => item.query.toLowerCase() !== normalized,
  );
  save(ISLAMIC_SEARCH_HISTORY_KEY, next);
  return next;
}

export function filterByQuery<T>(
  items: T[],
  query: string,
  getLabel: (item: T) => string,
): T[] {
  const normalized = normalizeSearchQuery(query).toLowerCase();
  if (!normalized) {
    return items;
  }
  return items.filter(item => getLabel(item).toLowerCase().includes(normalized));
}

export function buildPopularSurahSuggestions(
  language: 'ar' | 'en',
  query = '',
): IslamicSearchSuggestion[] {
  const items = POPULAR_SURAH_SUGGESTIONS.map(surah => ({
    id: `surah-${surah.number}`,
    label: language === 'ar' ? `${surah.number}. ${surah.ar}` : `${surah.number}. ${surah.en}`,
    query: language === 'ar' ? surah.ar : surah.en,
    kind: 'surah' as const,
    surahNumber: surah.number,
  }));
  return filterByQuery(items, query, item => item.label);
}

export function buildFeaturedAdhkarSuggestions(
  language: 'ar' | 'en',
  resolveTitle: (titleKey: string) => string,
  query = '',
): IslamicSearchSuggestion[] {
  const items = FEATURED_ADHKAR_SUGGESTIONS.map(item => ({
    id: `adhkar-${item.id}`,
    label: resolveTitle(item.titleKey),
    query: language === 'ar' ? item.queryAr : item.queryEn,
    kind: 'adhkar' as const,
    categoryId: item.id,
  }));
  return filterByQuery(items, query, item => `${item.label} ${item.query}`);
}

export function buildFeaturedHadithSuggestions(
  language: 'ar' | 'en',
  query = '',
): IslamicSearchSuggestion[] {
  const items = FEATURED_HADITH_SUGGESTIONS.map(item => ({
    id: `hadith-${item.slug}`,
    label: language === 'ar' ? item.labelAr : item.labelEn,
    query: language === 'ar' ? item.queryAr : item.queryEn,
    kind: 'hadith' as const,
  }));
  return filterByQuery(items, query, item => `${item.label} ${item.query}`);
}

export function buildRecentSuggestions(
  history: IslamicSearchHistoryEntry[],
  query = '',
): IslamicSearchSuggestion[] {
  const items = history.map(entry => ({
    id: `recent-${entry.query}`,
    label: entry.query,
    query: entry.query,
    kind: 'recent' as const,
  }));
  return filterByQuery(items, query, item => item.label);
}
