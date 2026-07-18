import {
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

/** Hadislam API rejects page_size > 20. */
export const HADITH_PAGE_SIZE = 20;
const PAGE_SIZE = HADITH_PAGE_SIZE;
const MAX_FILTER_SCAN_PAGES = 25;

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
  // Weak: graded da'eef/mawdu only (grade API param is ignored by Hadislam).
  return isWeakHadith(item.grades);
};

const fetchSearchPage = async (query: string, language: string, page: number) => {
  const {data} = await hadithHttpClient.get<HadislamPaginatedDto<HadislamHadithDto>>(
    '/hadiths/search',
    {
      params: {
        q: query,
        page,
        page_size: PAGE_SIZE,
        language,
      },
    },
  );
  return data;
};

export const hadithClient = {
  getEditions: async (): Promise<HadithEdition[]> => {
    const {data} = await hadithHttpClient.get<HadislamEditionDto[]>('/editions/');
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
    const {data} = await hadithHttpClient.get<
      HadislamPaginatedDto<HadislamBookDto> | HadislamBookDto[]
    >(`/editions/${slug}/books`, {params: {page_size: 200}});

    const items = Array.isArray(data) ? data : data.items ?? [];
    return items.map(mapHadithBook);
  },

  getEditionHadiths: async (
    slug: string,
    page = 1,
    language = 'en',
  ): Promise<{items: HadithSummary[]; total: number; page: number; pageSize: number}> => {
    const {data} = await hadithHttpClient.get<HadislamPaginatedDto<HadislamHadithDto>>(
      `/editions/${slug}/hadiths`,
      {params: {page, page_size: PAGE_SIZE, language}},
    );
    return {
      items: data.items.map(item => mapHadithSummary(item, language)),
      total: data.total,
      page: data.page,
      pageSize: data.page_size ?? PAGE_SIZE,
    };
  },

  getHadithById: async (hadithId: string, language = 'en'): Promise<HadithDetail> => {
    const {data} = await hadithHttpClient.get<HadislamHadithDto>(`/hadiths/${hadithId}`, {
      params: {language},
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
        items: data.items.map(item => mapHadithSummary(item, language)),
        total: data.total,
        page: data.page,
        pageSize: data.page_size ?? PAGE_SIZE,
      };
    }

    // Client-side sahih/weak filters: scan API pages until we can fill the
    // requested logical page (Hadislam ignores grade= params).
    const needed = page * PAGE_SIZE;
    const matched: HadithSummary[] = [];
    let apiPage = 1;
    let apiTotal = 0;
    let scannedRaw = 0;

    while (matched.length < needed && apiPage <= MAX_FILTER_SCAN_PAGES) {
      const data = await fetchSearchPage(query, language, apiPage);
      apiTotal = data.total;
      const mapped = data.items.map(item => mapHadithSummary(item, language));
      scannedRaw += mapped.length;
      matched.push(...mapped.filter(item => matchesCollectionFilter(item, filter)));
      if (mapped.length === 0) {
        break;
      }
      apiPage += 1;
    }

    const start = (page - 1) * PAGE_SIZE;
    const items = matched.slice(start, start + PAGE_SIZE);
    const exhausted = scannedRaw === 0 || apiPage > Math.ceil(apiTotal / PAGE_SIZE);
    const ratio = scannedRaw > 0 ? matched.length / scannedRaw : 0;
    const estimatedTotal = exhausted
      ? matched.length
      : Math.max(matched.length, Math.floor(apiTotal * ratio));

    return {
      items,
      total: estimatedTotal,
      page,
      pageSize: PAGE_SIZE,
    };
  },

  getRandomHadith: async (filter: HadithCollectionFilter = 'sahih', language = 'en') => {
    const params: Record<string, string> = {language};

    if (filter === 'sahih' || filter === 'weak') {
      const slugPool = filter === 'sahih' ? SAHIH_EDITION_SLUGS : WEAK_SEARCH_EDITIONS;
      const slug = slugPool[Math.floor(Math.random() * slugPool.length)];
      const editionId = await resolveEditionObjectId(slug);
      if (editionId) {
        params.edition = editionId;
      }
    }

    const {data} = await hadithHttpClient.get<HadislamHadithDto>('/hadiths/random', {
      params,
    });
    return mapHadithDetail(data, language);
  },
};
