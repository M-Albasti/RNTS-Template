import {
  hasHadithText,
  isSahihHadith,
  isWeakHadith,
  mapHadithBook,
  mapHadithDetail,
  mapHadithEdition,
  mapHadithSummary,
} from '@api/mappers/islamic.mapper';
import type {
  HadislamBookDto,
  HadislamEditionDto,
  HadislamHadithDto,
  HadislamPaginatedDto,
} from '@api/server/islamic.dto';
import {hadithHttpClient} from '@config/network/islamicHttpClient';
import {enqueueHadithRequest} from '@helpers/hadithRateLimit';
import type {HadithBook, HadithDetail, HadithEdition, HadithSummary} from '@Types/islamicTypes';

export type HadithCollectionFilter = 'all' | 'sahih' | 'weak';

const SAHIH_EDITION_SLUGS = [
  'sahih-al-bukhari',
  'sahih-muslim',
  'forty-hadith-of-an-nawawi',
  'forty-hadith-qudsi',
];

const WEAK_SEARCH_EDITIONS = [
  'sunan-abu-dawud',
  'sunan-al-tirmidhi',
  'sunan-ibn-majah',
  'sunan-an-nasai',
];

/** Edition list pagination — API allows up to 100. */
export const HADITH_PAGE_SIZE = 50;
/** Search endpoint rejects page_size > 20. */
export const HADITH_SEARCH_PAGE_SIZE = 20;
/** Request both languages so UI can show Arabic + English together. */
export const HADITH_TEXT_LANGS = ['en', 'ar', 'ar-diacritics'] as const;

const LIST_PAGE_SIZE = HADITH_PAGE_SIZE;
const SEARCH_PAGE_SIZE = HADITH_SEARCH_PAGE_SIZE;
/** Safety cap so a hostile/empty API cannot loop forever while scanning filters. */
const MAX_FILTER_SCAN_PAGES = 50;

const isArabicQuery = (query: string): boolean => /[\u0600-\u06FF]/.test(query);

/** Axios-friendly `lang=en&lang=ar` (not `lang[]=`). */
const serializeHadithParams = (params: Record<string, unknown>): string => {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      }
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.join('&');
};

const hadithGet = <T>(url: string, params?: Record<string, unknown>) =>
  enqueueHadithRequest(async () => {
    const {data} = await hadithHttpClient.get<T>(url, {
      params,
      paramsSerializer: serializeHadithParams,
    });
    return data;
  });

const resolveEditionObjectId = async (slug: string): Promise<string | null> => {
  const editions = await hadithClient.getEditions();
  return editions.find(edition => edition.slug === slug)?.id ?? null;
};

const matchesCollectionFilter = (
  item: HadithSummary,
  filter: HadithCollectionFilter,
): boolean => {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'sahih') {
    return SAHIH_EDITION_SLUGS.includes(item.editionSlug) || isSahihHadith(item.grades);
  }
  return isWeakHadith(item.grades);
};

const mapAndKeepText = (items: HadislamHadithDto[], language: string): HadithSummary[] =>
  items
    .map(item => mapHadithSummary(item, language))
    .filter(
      item =>
        hasHadithText(item.text) ||
        hasHadithText(item.arabicText) ||
        hasHadithText(item.englishText),
    );

const fetchSearchPage = async (query: string, language: string, page: number) =>
  hadithGet<HadislamPaginatedDto<HadislamHadithDto>>('/hadiths/search', {
    q: query,
    page,
    page_size: SEARCH_PAGE_SIZE,
    lang: [...HADITH_TEXT_LANGS],
    // Search Arabic queries against Arabic text index when possible.
    ...(isArabicQuery(query) ? {search_lang: 'ar'} : {search_lang: language}),
  });

export const hadithClient = {
  getEditions: async (): Promise<HadithEdition[]> => {
    const data = await hadithGet<HadislamEditionDto[]>('/editions/');
    return data.map(mapHadithEdition);
  },

  getSahihEditions: async (): Promise<HadithEdition[]> => {
    const editions = await hadithClient.getEditions();
    return editions.filter(edition => edition.category === 'sahih');
  },

  getSunanEditions: async (): Promise<HadithEdition[]> => {
    const editions = await hadithClient.getEditions();
    return editions.filter(edition => edition.category === 'sunan');
  },

  getEditionBooks: async (slug: string): Promise<HadithBook[]> => {
    const first = await hadithGet<HadislamPaginatedDto<HadislamBookDto> | HadislamBookDto[]>(
      `/editions/${slug}/books`,
      {page: 1, page_size: LIST_PAGE_SIZE},
    );
    if (Array.isArray(first)) {
      return first.map(mapHadithBook);
    }

    const books = [...(first.items ?? [])];
    const total = first.total ?? books.length;
    const pageSize = first.page_size ?? LIST_PAGE_SIZE;
    let page = first.page ?? 1;

    while (books.length < total) {
      page += 1;
      const next = await hadithGet<HadislamPaginatedDto<HadislamBookDto>>(
        `/editions/${slug}/books`,
        {page, page_size: pageSize},
      );
      const chunk = next.items ?? [];
      if (chunk.length === 0) {
        break;
      }
      books.push(...chunk);
      if (chunk.length < pageSize) {
        break;
      }
    }

    return books.map(mapHadithBook);
  },

  getEditionHadiths: async (
    slug: string,
    page = 1,
    language = 'en',
  ): Promise<{items: HadithSummary[]; total: number; page: number; pageSize: number}> => {
    const data = await hadithGet<HadislamPaginatedDto<HadislamHadithDto>>(
      `/editions/${slug}/hadiths`,
      {
        page,
        page_size: LIST_PAGE_SIZE,
        lang: [...HADITH_TEXT_LANGS],
      },
    );
    return {
      items: mapAndKeepText(data.items, language),
      total: data.total,
      page: data.page,
      pageSize: data.page_size ?? LIST_PAGE_SIZE,
    };
  },

  getHadithById: async (hadithId: string, language = 'en'): Promise<HadithDetail> => {
    const data = await hadithGet<HadislamHadithDto>(`/hadiths/${hadithId}`, {
      lang: [...HADITH_TEXT_LANGS],
    });
    return mapHadithDetail(data, language);
  },

  searchHadiths: async (
    query: string,
    filter: HadithCollectionFilter = 'all',
    language = 'en',
    page = 1,
  ): Promise<{items: HadithSummary[]; total: number; page: number; pageSize: number}> => {
    if (filter === 'all') {
      const data = await fetchSearchPage(query, language, page);
      return {
        items: mapAndKeepText(data.items ?? [], language),
        total: data.total ?? 0,
        page: data.page ?? page,
        pageSize: data.page_size ?? SEARCH_PAGE_SIZE,
      };
    }

    const needed = page * SEARCH_PAGE_SIZE;
    const matched: HadithSummary[] = [];
    let apiPage = 1;
    let apiTotal = 0;
    let scannedRaw = 0;
    let exhausted = false;

    // Scan API pages until this result page is filled or the corpus is exhausted
    // (do not cap every filtered page to the first ~60 raw hits).
    while (matched.length < needed && apiPage <= MAX_FILTER_SCAN_PAGES) {
      const data = await fetchSearchPage(query, language, apiPage);
      apiTotal = data.total ?? 0;
      const raw = data.items ?? [];
      scannedRaw += raw.length;
      matched.push(
        ...mapAndKeepText(raw, language).filter(item =>
          matchesCollectionFilter(item, filter),
        ),
      );
      if (raw.length === 0) {
        exhausted = true;
        break;
      }
      const apiTotalPages = Math.max(1, Math.ceil(apiTotal / SEARCH_PAGE_SIZE));
      if (apiPage >= apiTotalPages || raw.length < SEARCH_PAGE_SIZE) {
        exhausted = true;
        break;
      }
      apiPage += 1;
    }

    if (apiPage > MAX_FILTER_SCAN_PAGES) {
      exhausted = scannedRaw >= apiTotal;
    }

    const start = (page - 1) * SEARCH_PAGE_SIZE;
    const items = matched.slice(start, start + SEARCH_PAGE_SIZE);
    const ratio = scannedRaw > 0 ? matched.length / scannedRaw : 0;
    const estimatedTotal = exhausted
      ? matched.length
      : Math.max(matched.length, Math.floor(apiTotal * ratio));

    return {
      items,
      total: estimatedTotal,
      page,
      pageSize: SEARCH_PAGE_SIZE,
    };
  },

  getRandomHadith: async (filter: HadithCollectionFilter = 'sahih', language = 'en') => {
    const params: Record<string, unknown> = {
      lang: [...HADITH_TEXT_LANGS],
    };

    if (filter === 'sahih' || filter === 'weak') {
      const slugPool = filter === 'sahih' ? SAHIH_EDITION_SLUGS : WEAK_SEARCH_EDITIONS;
      const slug = slugPool[Math.floor(Math.random() * slugPool.length)];
      const editionId = await resolveEditionObjectId(slug);
      if (editionId) {
        params.edition = editionId;
      }
    }

    const data = await hadithGet<HadislamHadithDto>('/hadiths/random', params);
    return mapHadithDetail(data, language);
  },
};
