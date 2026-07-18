import {createSlice, PayloadAction, type Reducer} from '@reduxjs/toolkit';

import type {
  AdhkarPreferences,
  HadithLastRead,
  IslamicNotificationSettings,
  PrayerLocation,
  PrayerReminderKey,
  PrayerReminderSettings,
  QuranLastRead,
  QuranPreferences,
} from '@Types/islamicTypes';
import {PRAYER_SCHEDULE_KEYS} from '@helpers/prayerScheduleHelpers';
import {DEFAULT_ADHKAR_RECITER_ID} from '@constants/adhkarReciters';
import {DEFAULT_QURAN_RECITER_ID} from '@constants/quranReciters';
import {DEFAULT_TAFSIR_EDITION_ID} from '@constants/quranTafsirEditions';

type IslamicState = {
  lastReadSurah: number;
  lastRead: QuranLastRead;
  bookmarkedAyahs: string[];
  bookmarkedHadiths: string[];
  lastHadith: HadithLastRead | null;
  /** @deprecated Prefer prayerLocation — kept in sync for older persisted state. */
  prayerCity: string;
  prayerCountry: string;
  prayerLocation: PrayerLocation;
  notificationSettings: IslamicNotificationSettings;
  prayerReminders: PrayerReminderSettings;
  fcmToken: string | null;
  quranPreferences: QuranPreferences;
  adhkarPreferences: AdhkarPreferences;
};

const defaultNotificationSettings: IslamicNotificationSettings = {
  enabled: false,
  hourlyReminders: true,
  includeQuran: true,
  includeHadith: true,
  includeAdhkar: true,
};

const defaultPrayerReminders = (): PrayerReminderSettings => ({
  enabledAll: false,
  byKey: {},
});

const defaultQuranPreferences: QuranPreferences = {
  /** mp3quran.net continuous surah — Yasser Al-Dosari */
  reciterId: DEFAULT_QURAN_RECITER_ID,
  tafsirEditionId: DEFAULT_TAFSIR_EDITION_ID,
  showTafsir: true,
  showTranslation: false,
};

const defaultAdhkarPreferences: AdhkarPreferences = {
  reciterId: DEFAULT_ADHKAR_RECITER_ID,
};

/** User has not confirmed a location yet — show setup before timings. */
export const defaultPrayerLocation: PrayerLocation = {
  mode: 'unset',
  city: '',
  country: '',
  latitude: null,
  longitude: null,
  timezone: null,
  timezoneId: null,
  label: '',
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
  bookmarkedHadiths: [],
  lastHadith: null,
  prayerCity: '',
  prayerCountry: '',
  prayerLocation: defaultPrayerLocation,
  notificationSettings: defaultNotificationSettings,
  prayerReminders: defaultPrayerReminders(),
  fcmToken: null,
  quranPreferences: defaultQuranPreferences,
  adhkarPreferences: defaultAdhkarPreferences,
};

const applyPrayerLocation = (state: IslamicState, location: PrayerLocation) => {
  state.prayerLocation = location;
  state.prayerCity = location.city;
  state.prayerCountry = location.country;
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
    updateAdhkarPreferences: (
      state,
      action: PayloadAction<Partial<AdhkarPreferences>>,
    ) => {
      state.adhkarPreferences = {
        ...defaultAdhkarPreferences,
        ...state.adhkarPreferences,
        ...action.payload,
      };
    },
    toggleBookmarkAyah: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.bookmarkedAyahs.includes(key)) {
        state.bookmarkedAyahs = state.bookmarkedAyahs.filter(item => item !== key);
      } else {
        state.bookmarkedAyahs.push(key);
      }
    },
    setLastHadith: (state, action: PayloadAction<HadithLastRead>) => {
      state.lastHadith = action.payload;
    },
    toggleBookmarkHadith: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.bookmarkedHadiths) {
        state.bookmarkedHadiths = [];
      }
      if (state.bookmarkedHadiths.includes(id)) {
        state.bookmarkedHadiths = state.bookmarkedHadiths.filter(item => item !== id);
      } else {
        state.bookmarkedHadiths.push(id);
      }
    },
    setPrayerLocation: (state, action: PayloadAction<PrayerLocation>) => {
      applyPrayerLocation(state, action.payload);
    },
    /** Legacy city/country setter — marks mode as city. */
    setPrayerCityCountry: (
      state,
      action: PayloadAction<{city: string; country: string}>,
    ) => {
      applyPrayerLocation(state, {
        mode: 'city',
        city: action.payload.city,
        country: action.payload.country,
        latitude: null,
        longitude: null,
        timezone: null,
        timezoneId: null,
        label: `${action.payload.city}, ${action.payload.country}`,
      });
    },
    clearPrayerLocation: state => {
      applyPrayerLocation(state, defaultPrayerLocation);
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
    setPrayerReminderEnabledAll: (state, action: PayloadAction<boolean>) => {
      state.prayerReminders.enabledAll = action.payload;
      if (action.payload) {
        const byKey: Partial<Record<PrayerReminderKey, boolean>> = {};
        for (const key of PRAYER_SCHEDULE_KEYS) {
          byKey[key] = true;
        }
        state.prayerReminders.byKey = byKey;
      } else {
        state.prayerReminders.byKey = {};
      }
    },
    togglePrayerReminder: (state, action: PayloadAction<PrayerReminderKey>) => {
      const key = action.payload;
      const next = !state.prayerReminders.byKey[key];
      state.prayerReminders.byKey[key] = next;
      if (!next) {
        state.prayerReminders.enabledAll = false;
      } else {
        const allOn = PRAYER_SCHEDULE_KEYS.every(item => state.prayerReminders.byKey[item]);
        state.prayerReminders.enabledAll = allOn;
      }
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
  updateAdhkarPreferences,
  toggleBookmarkAyah,
  setLastHadith,
  toggleBookmarkHadith,
  setPrayerLocation,
  setPrayerCityCountry,
  clearPrayerLocation,
  updateNotificationSettings,
  setPrayerReminderEnabledAll,
  togglePrayerReminder,
  setFcmToken,
} = islamicSlice.actions;

/** Fill fields added after older app versions were persisted. */
const normalizeIslamicState = (state: IslamicState): IslamicState => {
  if (
    state.adhkarPreferences &&
    state.prayerLocation &&
    state.quranPreferences &&
    state.notificationSettings &&
    state.prayerReminders &&
    state.lastRead
  ) {
    return state;
  }
  return {
    ...initialState,
    ...state,
    lastRead: state.lastRead ?? initialState.lastRead,
    bookmarkedAyahs: state.bookmarkedAyahs ?? [],
    bookmarkedHadiths: state.bookmarkedHadiths ?? [],
    lastHadith: state.lastHadith ?? null,
    notificationSettings: {
      ...defaultNotificationSettings,
      ...state.notificationSettings,
    },
    prayerReminders: {
      ...defaultPrayerReminders(),
      ...state.prayerReminders,
      byKey: {
        ...defaultPrayerReminders().byKey,
        ...state.prayerReminders?.byKey,
      },
    },
    quranPreferences: {
      ...defaultQuranPreferences,
      ...state.quranPreferences,
    },
    adhkarPreferences: {
      ...defaultAdhkarPreferences,
      ...state.adhkarPreferences,
    },
    prayerLocation: {
      ...defaultPrayerLocation,
      ...state.prayerLocation,
    },
  };
};

const islamicReducer: Reducer<IslamicState> = (state, action) =>
  normalizeIslamicState(islamicSlice.reducer(state, action));

export default islamicReducer;
