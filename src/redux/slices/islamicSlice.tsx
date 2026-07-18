import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {IslamicNotificationSettings, QuranLastRead, QuranPreferences} from '@Types/islamicTypes';
import {DEFAULT_QURAN_RECITER_ID} from '@constants/quranReciters';
import {DEFAULT_TAFSIR_EDITION_ID} from '@constants/quranTafsirEditions';

type IslamicState = {
  lastReadSurah: number;
  lastRead: QuranLastRead;
  bookmarkedAyahs: string[];
  prayerCity: string;
  prayerCountry: string;
  notificationSettings: IslamicNotificationSettings;
  fcmToken: string | null;
  quranPreferences: QuranPreferences;
};

const defaultNotificationSettings: IslamicNotificationSettings = {
  enabled: false,
  hourlyReminders: true,
  includeQuran: true,
  includeHadith: true,
  includeAdhkar: true,
};

const defaultQuranPreferences: QuranPreferences = {
  /** mp3quran.net continuous surah — Yasser Al-Dosari */
  reciterId: DEFAULT_QURAN_RECITER_ID,
  tafsirEditionId: DEFAULT_TAFSIR_EDITION_ID,
  showTafsir: true,
  showTranslation: false,
};

/** Migrate legacy CDN/everyayah reciter ids to mp3quran continuous ids. */
const LEGACY_RECITER_MAP: Record<string, string> = {
  'ar.alafasy': '123',
  'yasser-dossari': '92',
  'ar.abdurrahmaansudais': '54',
  'ar.saoodshuraym': '31',
  'ar.husary': '118',
  'ar.minshawi': '112',
  'ar.mahermuaiqly': '102',
  'ar.abdulbasitmurattal': '51',
  'ar.hudhaify': '4',
  'ar.shaatree': '4',
};

const initialState: IslamicState = {
  lastReadSurah: 1,
  lastRead: {surahNumber: 1, ayahNumber: 1},
  bookmarkedAyahs: [],
  prayerCity: 'Mecca',
  prayerCountry: 'Saudi Arabia',
  notificationSettings: defaultNotificationSettings,
  fcmToken: null,
  quranPreferences: defaultQuranPreferences,
};

const islamicSlice = createSlice({
  name: 'islamic',
  initialState,
  reducers: {
    setLastReadSurah: (state, action: PayloadAction<number>) => {
      state.lastReadSurah = action.payload;
    },
    setLastReadPosition: (state, action: PayloadAction<QuranLastRead>) => {
      state.lastRead = action.payload;
      state.lastReadSurah = action.payload.surahNumber;
    },
    updateQuranPreferences: (state, action: PayloadAction<Partial<QuranPreferences>>) => {
      const next = {...state.quranPreferences, ...action.payload};
      if (next.reciterId && LEGACY_RECITER_MAP[next.reciterId]) {
        next.reciterId = LEGACY_RECITER_MAP[next.reciterId];
      }
      state.quranPreferences = next;
    },
    toggleBookmarkAyah: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.bookmarkedAyahs.includes(key)) {
        state.bookmarkedAyahs = state.bookmarkedAyahs.filter(item => item !== key);
      } else {
        state.bookmarkedAyahs.push(key);
      }
    },
    setPrayerLocation: (
      state,
      action: PayloadAction<{city: string; country: string}>,
    ) => {
      state.prayerCity = action.payload.city;
      state.prayerCountry = action.payload.country;
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<IslamicNotificationSettings>>,
    ) => {
      state.notificationSettings = {
        ...state.notificationSettings,
        ...action.payload,
      };
    },
    setFcmToken: (state, action: PayloadAction<string | null>) => {
      state.fcmToken = action.payload;
    },
  },
});

export const {
  setLastReadSurah,
  setLastReadPosition,
  updateQuranPreferences,
  toggleBookmarkAyah,
  setPrayerLocation,
  updateNotificationSettings,
  setFcmToken,
} = islamicSlice.actions;

export default islamicSlice.reducer;
