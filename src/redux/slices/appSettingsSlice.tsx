//* packages import
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

//* types import
import {Languages} from '@Types/languages';

interface appSettings {
  lang: Languages;
  error: object | string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Declare and export a type for the slice's state
export type appSettingsState = appSettings;

const initialState: appSettingsState = {
  lang: 'en',
  error: null,
  status: 'idle', //* 'idle' |  'loading' | 'succeeded' | 'failed'
};

// Create async action to add language
export const addLanguage = createAsyncThunk(
  'appSettings/addLanguage',
  async (lang: Languages, {rejectWithValue}) => {
    try {
      console.log('Setting language to', lang);
      return lang;
    } catch (error) {
      return rejectWithValue('Failed to add language');
    }
  },
);

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState: initialState,
  reducers: {
    resetLanguage: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Use `extraReducers` to handle actions that were generated
    // _outside_ of the slice, such as thunks or in other slices
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

export const {resetLanguage} = appSettingsSlice.actions;
export default appSettingsSlice.reducer;
