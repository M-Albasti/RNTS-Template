export type AlQuranApiResponse<T> = {
  code: number;
  status: string;
  data: T;
};

export type SurahSummaryDto = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
};

export type AyahDto = {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  juz: number;
  page: number;
  sajda: boolean | {id: number; recommended: boolean; obligatory: boolean};
};

export type SurahDetailDto = SurahSummaryDto & {
  ayahs: AyahDto[];
};

export type QuranSearchResponseDto = {
  count: number;
  matches: Array<{
    number: number;
    text: string;
    numberInSurah: number;
    surah: SurahSummaryDto;
    edition: {
      identifier: string;
      language: string;
      name: string;
    };
  }>;
};

export type HisnCategoryDto = {
  ID: number;
  TITLE: string;
  AUDIO_URL?: string;
  TEXT: string;
};

export type HisnItemDto = {
  ID: number;
  ARABIC_TEXT: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
  TRANSLATED_TEXT?: string;
  REPEAT: number;
  AUDIO?: string;
};

export type HadislamEditionDto = {
  _id: string;
  slug: string;
  name: {en: string; ar?: string};
  hadithCount: number;
  bookCount: number;
  availableLanguages: string[];
};

export type HadislamPaginatedDto<T> = {
  total: number;
  page: number;
  page_size: number;
  items: T[];
};

export type HadislamHadithDto = {
  _id: string;
  editionId: string;
  bookIndex: number;
  hadithIndex: number;
  hadithIndexMinor: number | null;
  bookHadithIndex: number;
  text: Record<string, string>;
  grades: Array<{name: string; grade: string}>;
  /** Optional explanation fields (not always present on Hadislam). */
  tafsir?: string | Record<string, string>;
  commentary?: string | Record<string, string>;
  explanation?: string | Record<string, string>;
  edition?: HadislamEditionDto;
  book?: {
    _id: string;
    name: {en: string; ar?: string};
    bookIndex: number;
    hadithCount: number;
  };
};

export type HadislamBookDto = {
  _id: string;
  name: {en: string; ar?: string};
  bookIndex: number;
  hadithCount: number;
};

export type PrayerTimingsResponseDto = {
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      Midnight?: string;
      Imsak?: string;
      Sunset?: string;
    };
    date: {
      readable: string;
      hijri: {day: string; month: {en: string; ar: string; number?: number}; year: string};
    };
  };
};
