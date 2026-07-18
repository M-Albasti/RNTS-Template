import {getQuranReciterById} from '@constants/quranReciters';

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
  if (surahNumber < 1 || surahNumber > 114 || ayahNumber < 1) {
    return null;
  }

  return {surahNumber, ayahNumber};
};

export const ayahBookmarkKey = (surahNumber: number, ayahNumber: number) =>
  `${surahNumber}:${ayahNumber}`;
