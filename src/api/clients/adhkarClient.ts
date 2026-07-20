import {mapHisnCategory, mapHisnItem} from '@api/mappers/islamic.mapper';
import type {HisnCategoryDto, HisnItemDto} from '@api/server/islamic.dto';
import {adhkarHttpClient} from '@config/network/islamicHttpClient';
import {normalizeSearchText} from '@helpers/islamicSearchHelpers';
import type {
  AdhkarCategory,
  AdhkarItem,
  AdhkarLanguage,
  AdhkarSearchMatch,
} from '@Types/islamicTypes';

const categoryListPath = (lang: AdhkarLanguage) =>
  lang === 'ar' ? '/ar/husn_ar.json' : '/en/husn_en.json';

const categoryListKey = (lang: AdhkarLanguage) => (lang === 'ar' ? 'العربية' : 'English');

/**
 * Hisn list payloads are `{ "English": [...] }` / `{ "العربية": [...] }`.
 * Fall back to the first array value so a BOM-prefixed key on iOS does not
 * silently resolve to an empty category list.
 */
const extractHisnArray = <T>(data: unknown, preferredKey: string): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (!data || typeof data !== 'object') {
    return [];
  }
  const record = data as Record<string, unknown>;
  const preferred = record[preferredKey];
  if (Array.isArray(preferred)) {
    return preferred as T[];
  }
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value) && key.replace(/^\uFEFF/, '') === preferredKey) {
      return value as T[];
    }
  }
  for (const value of Object.values(record)) {
    if (Array.isArray(value)) {
      return value as T[];
    }
  }
  return [];
};

const SEARCH_INDEX_BATCH = 12;
const SEARCH_RESULT_LIMIT = 60;

/** In-memory full-text index (Hisn has no search API). */
const searchIndexCache: Partial<Record<AdhkarLanguage, AdhkarSearchMatch[]>> = {};
const searchIndexPromises: Partial<Record<AdhkarLanguage, Promise<AdhkarSearchMatch[]>>> =
  {};

type SearchIndexBuild = {
  matches: AdhkarSearchMatch[];
  /** False when one or more category fetches failed — do not permanently cache. */
  complete: boolean;
};

const buildSearchIndex = async (lang: AdhkarLanguage): Promise<SearchIndexBuild> => {
  const categories = await adhkarClient.getCategories(lang);
  const matches: AdhkarSearchMatch[] = [];
  let hadFailure = false;

  for (let offset = 0; offset < categories.length; offset += SEARCH_INDEX_BATCH) {
    const batch = categories.slice(offset, offset + SEARCH_INDEX_BATCH);
    const batchResults = await Promise.all(
      batch.map(async category => {
        try {
          const {items} = await adhkarClient.getCategoryItems(category.id, lang);
          return items.map(
            (item): AdhkarSearchMatch => ({
              itemId: item.id,
              categoryId: category.id,
              categoryTitle: category.title,
              arabicText: item.arabicText,
              translatedText: item.translatedText,
              repeat: item.repeat,
            }),
          );
        } catch {
          hadFailure = true;
          return [];
        }
      }),
    );
    matches.push(...batchResults.flat());
  }

  return {matches, complete: !hadFailure};
};

const getSearchIndex = async (lang: AdhkarLanguage): Promise<AdhkarSearchMatch[]> => {
  const cached = searchIndexCache[lang];
  if (cached) {
    return cached;
  }

  const pending = searchIndexPromises[lang];
  if (pending) {
    return pending;
  }

  const promise = buildSearchIndex(lang)
    .then(({matches, complete}) => {
      // Only cache a full index — partial builds from silent failures must retry.
      if (complete) {
        searchIndexCache[lang] = matches;
      }
      return matches;
    })
    .finally(() => {
      delete searchIndexPromises[lang];
    });

  searchIndexPromises[lang] = promise;
  return promise;
};

export const adhkarClient = {
  getCategories: async (lang: AdhkarLanguage = 'ar'): Promise<AdhkarCategory[]> => {
    const {data} = await adhkarHttpClient.get<Record<string, HisnCategoryDto[]>>(
      categoryListPath(lang),
    );
    const categories = extractHisnArray<HisnCategoryDto>(data, categoryListKey(lang));
    if (!categories.length) {
      throw new Error('HisnMuslim categories response was empty');
    }
    return categories.map(category => mapHisnCategory(category, lang));
  },

  getCategoryItems: async (
    categoryId: number,
    lang: AdhkarLanguage = 'ar',
  ): Promise<{title: string; items: AdhkarItem[]}> => {
    const {data} = await adhkarHttpClient.get<Record<string, HisnItemDto[]>>(
      `/${lang}/${categoryId}.json`,
    );
    const entries =
      data && typeof data === 'object' && !Array.isArray(data)
        ? Object.entries(data as Record<string, HisnItemDto[]>)
        : [];
    const [rawTitle, items] = entries[0] ?? ['', [] as HisnItemDto[]];
    const title = String(rawTitle).replace(/^\uFEFF/, '');
    const list = Array.isArray(items) ? items : [];
    if (!list.length) {
      throw new Error(`HisnMuslim category ${categoryId} response was empty`);
    }
    return {
      title,
      items: list.map(mapHisnItem),
    };
  },

  getMorningAdhkar: async (lang: AdhkarLanguage = 'ar') =>
    adhkarClient.getCategoryItems(27, lang),

  getEveningAdhkar: async (lang: AdhkarLanguage = 'ar') =>
    adhkarClient.getCategoryItems(27, lang),

  getRandomDhikr: async (lang: AdhkarLanguage = 'ar'): Promise<AdhkarItem> => {
    const categories = await adhkarClient.getCategories(lang);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const {items} = await adhkarClient.getCategoryItems(category.id, lang);
    const item = items[Math.floor(Math.random() * items.length)];
    return item;
  },

  /** @deprecated Prefer searchItems for dhikr body text. */
  searchCategories: async (query: string, lang: AdhkarLanguage = 'ar'): Promise<AdhkarCategory[]> => {
    const categories = await adhkarClient.getCategories(lang);
    const normalized = normalizeSearchText(query);
    if (!normalized) {
      return categories;
    }
    return categories.filter(
      category =>
        normalizeSearchText(category.title).includes(normalized) ||
        String(category.id) === normalized,
    );
  },

  /**
   * Full-text search across every Hisn al-Muslim dhikr (Arabic + translation)
   * and category titles. Builds a cached index on first use.
   */
  searchItems: async (
    query: string,
    lang: AdhkarLanguage = 'ar',
  ): Promise<AdhkarSearchMatch[]> => {
    const normalized = normalizeSearchText(query);
    if (!normalized) {
      return [];
    }

    const index = await getSearchIndex(lang);
    const seenCategories = new Set<number>();
    const itemHits: AdhkarSearchMatch[] = [];
    const categoryHits: AdhkarSearchMatch[] = [];

    for (const entry of index) {
      const arabicHit = normalizeSearchText(entry.arabicText).includes(normalized);
      const translationHit = normalizeSearchText(entry.translatedText).includes(normalized);
      const categoryHit = normalizeSearchText(entry.categoryTitle).includes(normalized);

      if (arabicHit || translationHit) {
        itemHits.push(entry);
      } else if (categoryHit && !seenCategories.has(entry.categoryId)) {
        seenCategories.add(entry.categoryId);
        categoryHits.push({...entry, isCategoryMatch: true});
      }

      if (itemHits.length + categoryHits.length >= SEARCH_RESULT_LIMIT) {
        break;
      }
    }

    return [...itemHits, ...categoryHits].slice(0, SEARCH_RESULT_LIMIT);
  },
};

/** Hisn Muslim category IDs (verified against hisnmuslim.com/api). */
export const ADHKAR_FEATURED_CATEGORY_IDS = {
  morningEvening: 27,
  sleep: 28,
  waking: 1,
  afterPrayer: 25, // الأذكار بعد السلام من الصلاة
  mosque: 12,
  travel: 96,
  food: 69,
  anxiety: 34,
  forgiveness: 129,
} as const;
