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
  reciterId: DEFAULT_QURAN_RECITER_ID,
  tafsirEditionId: DEFAULT_TAFSIR_EDITION_ID,
  showTafsir: true,
  showTranslation: false,
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
      state.quranPreferences = {...state.quranPreferences, ...action.payload};
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
