import {
  mapQuranSearchMatch,
  mapSurahDetail,
  mapSurahSummary,
} from '@api/mappers/islamic.mapper';
import {DEFAULT_TAFSIR_EDITION_ID} from '@constants/quranTafsirEditions';
import type {
  AlQuranApiResponse,
  AyahDto,
  QuranSearchResponseDto,
  SurahDetailDto,
  SurahSummaryDto,
} from '@api/server/islamic.dto';
import {quranHttpClient} from '@config/network/islamicHttpClient';
import {parseAyahReference} from '@helpers/quranAudioHelpers';
import type {
  QuranJuzSummary,
  QuranSearchMatch,
  QuranSurahDetail,
  QuranSurahSummary,
} from '@Types/islamicTypes';

const arabicEdition = 'quran-uthmani';
const translationEdition = 'en.sahih';

const mergeSurahEditions = (
  arabic: SurahDetailDto,
  tafsir?: SurahDetailDto,
  translation?: SurahDetailDto,
): QuranSurahDetail => {
  const base = mapSurahDetail(arabic);
  return {
    ...base,
    ayahs: base.ayahs.map(ayah => ({
      ...ayah,
      tafsir: tafsir?.ayahs.find(item => item.numberInSurah === ayah.numberInSurah)?.text,
      translation: translation?.ayahs.find(item => item.numberInSurah === ayah.numberInSurah)
        ?.text,
    })),
  };
};

export const quranClient = {
  getSurahList: async (): Promise<QuranSurahSummary[]> => {
    const {data} = await quranHttpClient.get<AlQuranApiResponse<SurahSummaryDto[]>>('/surah');
    return data.data.map(mapSurahSummary);
  },

  getSurahReading: async (
    surahNumber: number,
    tafsirEditionId = DEFAULT_TAFSIR_EDITION_ID,
    withTranslation = true,
  ): Promise<QuranSurahDetail> => {
    const requests = [
      quranHttpClient.get<AlQuranApiResponse<SurahDetailDto>>(
        `/surah/${surahNumber}/${arabicEdition}`,
      ),
      quranHttpClient.get<AlQuranApiResponse<SurahDetailDto>>(
        `/surah/${surahNumber}/${tafsirEditionId}`,
      ),
    ];

    if (withTranslation) {
      requests.push(
        quranHttpClient.get<AlQuranApiResponse<SurahDetailDto>>(
          `/surah/${surahNumber}/${translationEdition}`,
        ),
      );
    }

    const responses = await Promise.all(requests);
    const arabic = responses[0].data.data;
    const tafsir = responses[1].data.data;
    const translation = withTranslation ? responses[2]?.data.data : undefined;

    return mergeSurahEditions(arabic, tafsir, translation);
  },

  /** @deprecated use getSurahReading */
  getSurah: async (surahNumber: number, withTranslation = true): Promise<QuranSurahDetail> =>
    quranClient.getSurahReading(surahNumber, DEFAULT_TAFSIR_EDITION_ID, withTranslation),

  getJuzList: async (): Promise<QuranJuzSummary[]> => {
    const summaries = await Promise.all(
      Array.from({length: 30}, (_, index) => quranClient.getJuzSummary(index + 1)),
    );
    return summaries;
  },

  getJuzSummary: async (juzNumber: number): Promise<QuranJuzSummary> => {
    const {data} = await quranHttpClient.get<
      AlQuranApiResponse<{
        number: number;
        ayahs: Array<AyahDto & {surah: SurahSummaryDto}>;
      }>
    >(`/juz/${juzNumber}/${arabicEdition}`);
    const first = data.data.ayahs[0];
    return {
      number: juzNumber,
      firstAyahRef: `${first.surah.englishName} ${first.numberInSurah}`,
      firstSurahName: first.surah.name,
      ayahCount: data.data.ayahs.length,
    };
  },

  getJuzReading: async (juzNumber: number): Promise<{surahNumber: number; ayahNumber: number} | null> => {
    const {data} = await quranHttpClient.get<
      AlQuranApiResponse<{
        ayahs: Array<AyahDto & {surah: SurahSummaryDto}>;
      }>
    >(`/juz/${juzNumber}/${arabicEdition}`);
    const first = data.data.ayahs[0];
    if (!first?.surah) {
      return null;
    }
    return {
      surahNumber: first.surah.number,
      ayahNumber: first.numberInSurah,
    };
  },

  getAyahWithTafsir: async (
    surahNumber: number,
    ayahNumber: number,
    tafsirEditionId = DEFAULT_TAFSIR_EDITION_ID,
  ) => {
    const {data} = await quranHttpClient.get<
      AlQuranApiResponse<{
        number: number;
        text: string;
        numberInSurah: number;
        surah: SurahSummaryDto;
      }>
    >(
      `/ayah/${surahNumber}:${ayahNumber}/${arabicEdition},${translationEdition},${tafsirEditionId}`,
    );

    return {
      surahNumber,
      ayahNumber,
      arabic: data.data.text,
      surahName: data.data.surah.englishName,
    };
  },

  getRandomAyah: async (tafsirEditionId = DEFAULT_TAFSIR_EDITION_ID) => {
    const {data} = await quranHttpClient.get<
      AlQuranApiResponse<{
        number: number;
        text: string;
        numberInSurah: number;
        surah: SurahSummaryDto;
      }>
    >(`/ayah/random/${arabicEdition},${translationEdition},${tafsirEditionId}`);

    const ayah = data.data;
    return {
      surahNumber: ayah.surah.number,
      ayahNumber: ayah.numberInSurah,
      arabic: ayah.text.replace(/^\ufeff/, ''),
      surahName: ayah.surah.englishName,
      reference: `${ayah.surah.englishName} ${ayah.numberInSurah}`,
    };
  },

  searchQuranText: async (query: string, language = 'ar'): Promise<QuranSearchMatch[]> => {
    const edition = language === 'ar' ? 'quran-simple' : language;
    const {data} = await quranHttpClient.get<AlQuranApiResponse<QuranSearchResponseDto>>(
      `/search/${encodeURIComponent(query)}/all/${edition}`,
    );
    return data.data.matches.map(mapQuranSearchMatch);
  },

  /** @deprecated */
  searchQuran: async (query: string, language = 'en'): Promise<QuranSearchMatch[]> =>
    quranClient.searchQuranText(query, language),

  searchSurahByName: async (query: string): Promise<QuranSurahSummary[]> => {
    const surahs = await quranClient.getSurahList();
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return surahs;
    }
    return surahs.filter(
      surah =>
        surah.name.includes(query.trim()) ||
        surah.englishName.toLowerCase().includes(normalized) ||
        surah.englishNameTranslation.toLowerCase().includes(normalized) ||
        String(surah.number) === normalized,
    );
  },

  resolveAyahReference: (input: string) => parseAyahReference(input),
};
