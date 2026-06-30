import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {IslamicNotificationSettings} from '@Types/islamicTypes';

type IslamicState = {
  lastReadSurah: number;
  bookmarkedAyahs: string[];
  prayerCity: string;
  prayerCountry: string;
  notificationSettings: IslamicNotificationSettings;
};

const defaultNotificationSettings: IslamicNotificationSettings = {
  enabled: false,
  hourlyReminders: true,
  includeQuran: true,
  includeHadith: true,
  includeAdhkar: true,
};

const initialState: IslamicState = {
  lastReadSurah: 1,
  bookmarkedAyahs: [],
  prayerCity: 'Mecca',
  prayerCountry: 'Saudi Arabia',
  notificationSettings: defaultNotificationSettings,
};

const islamicSlice = createSlice({
  name: 'islamic',
  initialState,
  reducers: {
    setLastReadSurah: (state, action: PayloadAction<number>) => {
      state.lastReadSurah = action.payload;
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
  },
});

export const {
  setLastReadSurah,
  toggleBookmarkAyah,
  setPrayerLocation,
  updateNotificationSettings,
} = islamicSlice.actions;

export default islamicSlice.reducer;
