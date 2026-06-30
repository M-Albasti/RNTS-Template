import {
  mapQuranSearchMatch,
  mapSurahDetail,
  mapSurahSummary,
} from '@api/mappers/islamic.mapper';
import type {
  AlQuranApiResponse,
  QuranSearchResponseDto,
  SurahDetailDto,
  SurahSummaryDto,
} from '@api/server/islamic.dto';
import {quranHttpClient} from '@config/network/islamicHttpClient';
import type {QuranSearchMatch, QuranSurahDetail, QuranSurahSummary} from '@Types/islamicTypes';

const quranEdition = 'quran-uthmani';
const translationEdition = 'en.sahih';
const tafsirEdition = 'ar.muyassar';
const audioEdition = 'ar.alafasy';

export const quranClient = {
  getSurahList: async (): Promise<QuranSurahSummary[]> => {
    const {data} = await quranHttpClient.get<AlQuranApiResponse<SurahSummaryDto[]>>('/surah');
    return data.data.map(mapSurahSummary);
  },

  getSurah: async (
    surahNumber: number,
    withTranslation = true,
  ): Promise<QuranSurahDetail> => {
    const editions = withTranslation
      ? `${quranEdition},${translationEdition},${audioEdition}`
      : quranEdition;
    const {data} = await quranHttpClient.get<AlQuranApiResponse<SurahDetailDto>>(
      `/surah/${surahNumber}/${editions}`,
    );
    return mapSurahDetail(data.data);
  },

  getAyahWithTafsir: async (surahNumber: number, ayahNumber: number) => {
    const {data} = await quranHttpClient.get<
      AlQuranApiResponse<{
        number: number;
        text: string;
        numberInSurah: number;
        surah: SurahSummaryDto;
      }>
    >(`/ayah/${surahNumber}:${ayahNumber}/${quranEdition},${translationEdition},${tafsirEdition}`);

    return {
      surahNumber,
      ayahNumber,
      arabic: data.data.text,
      surahName: data.data.surah.englishName,
    };
  },

  getRandomAyah: async () => {
    const {data} = await quranHttpClient.get<
      AlQuranApiResponse<{
        number: number;
        text: string;
        numberInSurah: number;
        surah: SurahSummaryDto;
      }>
    >(`/ayah/random/${quranEdition},${translationEdition},${tafsirEdition}`);

    const ayah = data.data;
    return {
      surahNumber: ayah.surah.number,
      ayahNumber: ayah.numberInSurah,
      arabic: ayah.text.replace(/^\ufeff/, ''),
      surahName: ayah.surah.englishName,
      reference: `${ayah.surah.englishName} ${ayah.numberInSurah}`,
    };
  },

  searchQuran: async (query: string, language = 'en'): Promise<QuranSearchMatch[]> => {
    const {data} = await quranHttpClient.get<AlQuranApiResponse<QuranSearchResponseDto>>(
      `/search/${encodeURIComponent(query)}/all/${language}`,
    );
    return data.data.matches.map(mapQuranSearchMatch);
  },
};
