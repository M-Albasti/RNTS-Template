import type {QuranReciter} from '@constants/quranReciters';
import {getQuranReciterById} from '@constants/quranReciters';

export const buildAyahAudioUrl = (
  reciterId: string,
  globalAyahNumber: number,
  surahNumber: number,
  ayahInSurah: number,
): string => {
  const reciter = getQuranReciterById(reciterId);

  if (reciter.source === 'everyayah' && reciter.folder) {
    const surahPart = String(surahNumber).padStart(3, '0');
    const ayahPart = String(ayahInSurah).padStart(3, '0');
    return `https://everyayah.com/data/${reciter.folder}/${surahPart}${ayahPart}.mp3`;
  }

  return `https://cdn.islamic.network/quran/audio/128/${reciter.id}/${globalAyahNumber}.mp3`;
};

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
