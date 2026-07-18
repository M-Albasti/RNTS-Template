/**
 * Adhkar audio voices.
 * - `hisn`: per-dhikr clips from Hisn al-Muslim (حمد الدريهم) — item-by-item.
 * - Others: continuous full-session MP3s (Internet Archive / Makkah Live collection).
 */
export type AdhkarReciter = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Sequential Hisn clips vs one continuous session track. */
  mode: 'sequential' | 'continuous';
};

export const ADHKAR_RECITERS: AdhkarReciter[] = [
  {
    id: 'hisn',
    nameAr: 'حمد الدريهم',
    nameEn: 'Hamad Al-Durayhim',
    mode: 'sequential',
  },
  {
    id: 'afasy',
    nameAr: 'مشاري العفاسي',
    nameEn: 'Mishary Al-Afasy',
    mode: 'continuous',
  },
  {
    id: 'abbad',
    nameAr: 'فارس عباد',
    nameEn: 'Fares Abbad',
    mode: 'continuous',
  },
  {
    id: 'jibril',
    nameAr: 'محمد جبريل',
    nameEn: 'Muhammad Jibril',
    mode: 'continuous',
  },
  {
    id: 'qatami',
    nameAr: 'ناصر القطامي',
    nameEn: 'Nasser Al-Qatami',
    mode: 'continuous',
  },
];

export const DEFAULT_ADHKAR_RECITER_ID = 'hisn';

const ARCHIVE_BASE =
  'https://archive.org/download/makkah-live.-net-athkar-01/MakkahLive.Net_athkar';

/**
 * Continuous session tracks keyed by session → reciter.
 * Source: Makkah Live morning/evening collection (Internet Archive).
 */
export const ADHKAR_CONTINUOUS_TRACKS: Record<
  string,
  Partial<Record<string, string>>
> = {
  waking: {
    afasy: `${ARCHIVE_BASE}_01.mp3`,
  },
  dayNight: {
    qatami: `${ARCHIVE_BASE}_02.mp3`,
  },
  morning: {
    afasy: `${ARCHIVE_BASE}_03.mp3`,
    abbad: `${ARCHIVE_BASE}_05.mp3`,
    jibril: `${ARCHIVE_BASE}_07.mp3`,
  },
  evening: {
    afasy: `${ARCHIVE_BASE}_04.mp3`,
    abbad: `${ARCHIVE_BASE}_06.mp3`,
    jibril: `${ARCHIVE_BASE}_08.mp3`,
  },
  sleep: {
    afasy: `${ARCHIVE_BASE}_11.mp3`,
  },
};

export const getAdhkarReciterById = (id: string): AdhkarReciter =>
  ADHKAR_RECITERS.find(reciter => reciter.id === id) ?? ADHKAR_RECITERS[0];

/** Reciters that have a continuous track for this session (plus always Hisn). */
export const getRecitersForSession = (sessionId: string): AdhkarReciter[] => {
  const continuousIds = new Set(
    Object.keys(ADHKAR_CONTINUOUS_TRACKS[sessionId] ?? {}),
  );
  return ADHKAR_RECITERS.filter(
    reciter => reciter.id === 'hisn' || continuousIds.has(reciter.id),
  );
};

export const getContinuousTrackUrl = (
  sessionId: string,
  reciterId: string,
): string | undefined => ADHKAR_CONTINUOUS_TRACKS[sessionId]?.[reciterId];
