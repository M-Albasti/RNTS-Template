import {getQuranReciterById} from '@constants/quranReciters';

/** Ayah counts for surahs 1–114 (Madinah mushaf / Hafs). */
export const SURAH_AYAH_COUNTS: readonly number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111,
  110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83,
  182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96,
  29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31,
  50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5,
  8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

export const getSurahAyahCount = (surahNumber: number): number => {
  if (surahNumber < 1 || surahNumber > 114) {
    return 0;
  }
  return SURAH_AYAH_COUNTS[surahNumber - 1] ?? 0;
};

/** Continuous full-surah MP3 from mp3quran.net (no ayah cuts). */
export const buildSurahAudioUrl = (reciterId: string, surahNumber: number): string => {
  const reciter = getQuranReciterById(reciterId);
  const padded = String(surahNumber).padStart(3, '0');
  return `${reciter.server}${padded}.mp3`;
};

/** @deprecated Prefer buildSurahAudioUrl for gapless playback. */
export const buildAyahAudioUrl = (
  reciterId: string,
  _globalAyahNumber: number,
  surahNumber: number,
  _ayahInSurah: number,
): string => buildSurahAudioUrl(reciterId, surahNumber);

export const parseAyahReference = (
  input: string,
): {surahNumber: number; ayahNumber: number} | null => {
  const normalized = input.trim().replace(/[،,:]/g, ':').replace(/\s+/g, ':');
  const match = normalized.match(/^(\d{1,3}):(\d{1,3})$/);
  if (!match) {
    return null;
  }

  const surahNumber = Number(match[1]);
  const ayahNumber = Number(match[2]);
  const maxAyah = getSurahAyahCount(surahNumber);
  if (surahNumber < 1 || surahNumber > 114 || ayahNumber < 1 || ayahNumber > maxAyah) {
    return null;
  }

  return {surahNumber, ayahNumber};
};

export const ayahBookmarkKey = (surahNumber: number, ayahNumber: number) =>
  `${surahNumber}:${ayahNumber}`;
