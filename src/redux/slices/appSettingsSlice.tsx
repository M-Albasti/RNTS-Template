import {Languages} from '@Types/languages';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface appSettings {
  lang: Languages;
  error: object | string | null;
  status: string;
}

// Declare and export a type for the slice's state
export type appSettingsState = appSettings;

const initialState: appSettingsState = {
  lang: 'en',
  error: null,
  status: 'idel', //* 'idle' |  'loading' | 'succeeded' | 'failed'
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState: initialState,
  reducers: {
    addLanguage: (state, action: PayloadAction<Languages>) => {
      state.lang = action.payload;
    },
    resetLanguage: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Use `extraReducers` to handle actions that were generated
    // _outside_ of the slice, such as thunks or in other slices
  },
});

export const {addLanguage, resetLanguage} = appSettingsSlice.actions;
export default appSettingsSlice.reducer;
