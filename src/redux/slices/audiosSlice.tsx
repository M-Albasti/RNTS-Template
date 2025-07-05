//* packages import
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import moment from 'moment';

//* types import
import {SoundProps} from '@Types/soundProps';

interface audio {
  audios: object[];
  audioNames: SoundProps[];
  uploadedAudios: object[];
  error: object | string | null;
  status: string;
}

// Declare and export a type for the slice's state
export type audioState = audio;

const initialState: audioState = {
  audios: [],
  audioNames: [],
  uploadedAudios: [],
  error: null,
  status: 'idle', //* 'idle' |  'loading' | 'succeeded' | 'failed'
};

export const getAudio = createAsyncThunk<
  // Return type of the payload creator
  object | AxiosError,
  // First argument to the payload creator
  string
>('audio/getAudio', async (audioName: string) => {
  // Just make the async request here, and return the response.
  // This will automatically dispatch a `pending` action first,
  // and then `fulfilled` or `rejected` actions based on the promise.
  // as needed based on the
  return await axios({
    method: 'GET',
    url: `https://node-file-apis-2.onrender.com/files/${audioName}`,
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log('Error =>', error);
      throw error;
    });
});

export const uploadAudio = createAsyncThunk<
  // Return type of the payload creator
  object | AxiosError,
  // First argument to the payload creator
  FormData
>('audio/uploadAudio', async (audioFile: FormData) => {
  // Just make the async request here, and return the response.
  // This will automatically dispatch a `pending` action first,
  // and then `fulfilled` or `rejected` actions based on the promise.
  // as needed based on the
  return await axios({
    method: 'POST',
    url: 'https://node-file-apis-2.onrender.com/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: audioFile,
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log('Error =>', error);
      throw error;
    });
});

const audiosSlice = createSlice({
  name: 'audio',
  initialState: initialState,
  reducers: {
    addAudio: (state, action: PayloadAction<object>) => {
      state.audios = [...state.audios, action.payload];
    },
    resetAudios: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Use `extraReducers` to handle actions that were generated
    // _outside_ of the slice, such as thunks or in other slices
    builder
      .addCase(getAudio.pending, state => {
        state.status = 'loading';
      })
      // Pass the generated action creators to `.addCase()`
      .addCase(getAudio.fulfilled, (state, action: PayloadAction<object>) => {
        // Same "mutating" update syntax thanks to Immer
        state.status = 'succeeded';
        state.uploadedAudios = [...state.uploadedAudios, action.payload];
      })
      .addCase(
        getAudio.rejected,
        (state, action: AxiosError | string | any) => {
          state.status = 'failed';
          state.error = action.error.message;
        },
      );
    builder
      .addCase(uploadAudio.pending, state => {
        state.status = 'loading';
      })
      // Pass the generated action creators to `.addCase()`
      .addCase(
        uploadAudio.fulfilled,
        (state, action: PayloadAction<object | any>) => {
          // Same "mutating" update syntax thanks to Immer
          const audioObject: SoundProps = {
            id: action.payload.savedFileName,
            title: `audio-${moment().unix()}`,
            artist: 'artist Name',
            url: `https://node-file-apis-2.onrender.com/files/${action.payload.savedFileName}`,
            album: `album-${moment().unix()}`,
            artwork: 'https://picsum.photos/id/1003/200/300',
          };
          state.status = 'succeeded';
          state.audioNames = [...state.audioNames, audioObject];
        },
      )
      .addCase(
        uploadAudio.rejected,
        (state, action: AxiosError | string | any) => {
          state.status = 'failed';
          state.error = action.error.message;
        },
      );
  },
});

export const {addAudio, resetAudios} = audiosSlice.actions;
export default audiosSlice.reducer;
