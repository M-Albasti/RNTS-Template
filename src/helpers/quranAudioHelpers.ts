import {getQuranReciterById} from '@constants/quranReciters';

/** Ayah cue on a continuous surah timeline (ms from start of the surah MP3). */
export type QuranAyahTiming = {
  ayahNumber: number;
  startMs: number;
  endMs: number;
  pageNumber: number;
};

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

/** Continuous full-surah MP3 (what the user hears). */
export const buildSurahAudioUrl = (reciterId: string, surahNumber: number): string => {
  const reciter = getQuranReciterById(reciterId);
  const padded = String(surahNumber).padStart(3, '0');
  return `${reciter.server}${padded}.mp3`;
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
  const maxAyah = getSurahAyahCount(surahNumber);
  if (surahNumber < 1 || surahNumber > 114 || ayahNumber < 1 || ayahNumber > maxAyah) {
    return null;
  }

  return {surahNumber, ayahNumber};
};

export const ayahBookmarkKey = (surahNumber: number, ayahNumber: number) =>
  `${surahNumber}:${ayahNumber}`;

/** Extracts Madinah mushaf page from mp3quran SVG page URLs (`001.svg` → 1). */
export const parseMushafPageFromTimingUrl = (
  pageUrl: string | null | undefined,
): number | null => {
  if (!pageUrl) {
    return null;
  }
  const match = pageUrl.match(/(\d+)\.svg/i);
  if (!match) {
    return null;
  }
  const page = Number(match[1]);
  return Number.isFinite(page) && page >= 1 ? page : null;
};

export const findPageForAyah = (
  ayahPages: ReadonlyArray<{ayahNumber: number; pageNumber: number}> | undefined,
  ayahNumber: number,
): number | null => {
  if (!ayahPages?.length) {
    return null;
  }
  return ayahPages.find(item => item.ayahNumber === ayahNumber)?.pageNumber ?? null;
};

export const findTimingForAyah = (
  timings: readonly QuranAyahTiming[],
  ayahNumber: number,
): QuranAyahTiming | null => {
  if (!timings.length || ayahNumber < 1) {
    return null;
  }
  return timings.find(timing => timing.ayahNumber === ayahNumber) ?? null;
};

export const findTimingIndexAtMs = (
  timings: readonly QuranAyahTiming[],
  timeMs: number,
): number => {
  if (!timings.length) {
    return -1;
  }
  if (timeMs < timings[0].startMs) {
    return 0;
  }
  let index = 0;
  for (let i = 0; i < timings.length; i += 1) {
    if (timeMs >= timings[i].startMs) {
      index = i;
    } else {
      break;
    }
  }
  return index;
};

/** Delay until the next ayah boundary from the current cue index. */
export const msUntilNextAyah = (
  timings: readonly QuranAyahTiming[],
  timingIndex: number,
): number | null => {
  const next = timings[timingIndex + 1];
  const current = timings[timingIndex];
  if (!next || !current) {
    return null;
  }
  return Math.max(16, next.startMs - current.startMs);
};

/**
 * Even-split fallback when mp3quran ayat_timing is unavailable for a reciter.
 * Approximate — variable ayah lengths mean highlight may be slightly early/late.
 */
export const buildProportionalTimings = (
  ayahPages: ReadonlyArray<{ayahNumber: number; pageNumber: number}>,
  durationMs: number,
): QuranAyahTiming[] => {
  if (!ayahPages.length || durationMs <= 0) {
    return [];
  }

  const sliceMs = durationMs / ayahPages.length;
  return ayahPages.map((ayah, index) => ({
    ayahNumber: ayah.ayahNumber,
    pageNumber: ayah.pageNumber,
    startMs: index * sliceMs,
    endMs: (index + 1) * sliceMs,
  }));
};
