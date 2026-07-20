//* packages import
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

//* types import
import {Languages} from '@Types/languages';
import {ThemeMode} from '@Types/themeMode';

export type AppPreferences = {
  pushNotifications: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  biometricLock: boolean;
  soundEffects: boolean;
  haptics: boolean;
  autoPlayVideos: boolean;
  dataSaver: boolean;
  locationServices: boolean;
  analyticsSharing: boolean;
};

interface appSettings {
  lang: Languages;
  themeMode: ThemeMode;
  preferences: AppPreferences;
  error: object | string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export type appSettingsState = appSettings;

export const defaultPreferences: AppPreferences = {
  pushNotifications: true,
  emailNotifications: true,
  marketingEmails: false,
  biometricLock: false,
  soundEffects: true,
  haptics: true,
  autoPlayVideos: true,
  dataSaver: false,
  locationServices: true,
  analyticsSharing: true,
};

const initialState: appSettingsState = {
  lang: 'en',
  themeMode: 'system',
  preferences: defaultPreferences,
  error: null,
  status: 'idle',
};

/** Merge older persisted settings that predate the preferences map. */
export const ensureAppPreferences = (
  preferences?: Partial<AppPreferences> | null,
): AppPreferences => ({
  ...defaultPreferences,
  ...(preferences ?? {}),
});

export const addLanguage = createAsyncThunk(
  'appSettings/addLanguage',
  async (lang: Languages, {rejectWithValue}) => {
    try {
      return lang;
    } catch (error) {
      return rejectWithValue('Failed to add language');
    }
  },
);

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    resetLanguage: () => initialState,
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    setPreference: (
      state,
      action: PayloadAction<{key: keyof AppPreferences; value: boolean}>,
    ) => {
      state.preferences = ensureAppPreferences(state.preferences);
      state.preferences[action.payload.key] = action.payload.value;
    },
    togglePreference: (state, action: PayloadAction<keyof AppPreferences>) => {
      state.preferences = ensureAppPreferences(state.preferences);
      const key = action.payload;
      state.preferences[key] = !state.preferences[key];
    },
    /** Call after rehydrate if older snapshots lack preferences. */
    hydratePreferences: state => {
      state.preferences = ensureAppPreferences(state.preferences);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addLanguage.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        addLanguage.fulfilled,
        (state, action: PayloadAction<Languages>) => {
          state.status = 'succeeded';
          state.lang = action.payload;
        },
      )
      .addCase(addLanguage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as object | string | null;
      });
  },
});

export const {
  resetLanguage,
  setThemeMode,
  setPreference,
  togglePreference,
  hydratePreferences,
} = appSettingsSlice.actions;

export default appSettingsSlice.reducer;

/** Stable selector — never allocates a fresh object when preferences is missing. */
export const selectAppPreferences = (state: {
  appSettings: appSettingsState;
}): AppPreferences =>
  state.appSettings.preferences
    ? state.appSettings.preferences
    : defaultPreferences;
