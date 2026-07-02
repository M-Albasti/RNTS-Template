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
    const {data} = await hadithHttpClient.get<HadislamPaginatedDto<HadislamBookDto>>(
      `/editions/${slug}/books`,
      {params: {page_size: 200}},
    );
    return data.items.map(mapHadithBook);
  },

  getEditionHadiths: async (
    slug: string,
    page = 1,
    language = 'en',
  ): Promise<{items: HadithSummary[]; total: number}> => {
    const {data} = await hadithHttpClient.get<HadislamPaginatedDto<HadislamHadithDto>>(
      `/editions/${slug}/hadiths`,
      {params: {page, page_size: 20, language}},
    );
    return {
      items: data.items.map(item => mapHadithSummary(item, language)),
      total: data.total,
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
  ): Promise<HadithSummary[]> => {
    const params: Record<string, string | number> = {
      q: query,
      limit: 30,
      language,
    };

    if (filter === 'weak') {
      params.grade = 'Da`eef';
    }

    const {data} = await hadithHttpClient.get<HadislamPaginatedDto<HadislamHadithDto>>(
      '/hadiths/search',
      {params},
    );

    let items = data.items.map(item => mapHadithSummary(item, language));

    if (filter === 'sahih') {
      items = items.filter(
        item =>
          SAHIH_EDITION_SLUGS.includes(item.editionSlug) ||
          isSahihHadith(item.grades),
      );
    }

    if (filter === 'weak') {
      items = items.filter(item => isWeakHadith(item.grades));
    }

    return items;
  },

  getRandomHadith: async (filter: HadithCollectionFilter = 'sahih', language = 'en') => {
    const params: Record<string, string> = {language};
    if (filter === 'sahih') {
      params.edition = SAHIH_EDITION_SLUGS[
        Math.floor(Math.random() * SAHIH_EDITION_SLUGS.length)
      ];
    } else if (filter === 'weak') {
      params.edition = WEAK_SEARCH_EDITIONS[
        Math.floor(Math.random() * WEAK_SEARCH_EDITIONS.length)
      ];
    }

    const {data} = await hadithHttpClient.get<HadislamHadithDto>('/hadiths/random', {
      params,
    });
    return mapHadithDetail(data, language);
  },
};
