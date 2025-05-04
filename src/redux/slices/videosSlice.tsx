//* packages import
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import moment from 'moment';

//* types import
import {VideoProps} from '@Types/videoProps';

interface video {
  videos: object[];
  videoNames: VideoProps[];
  uploadedVideos: object[];
  error: object | string | null;
  status: string;
}

// Declare and export a type for the slice's state
export type videoState = video;

export const initialState: videoState = {
  videos: [],
  videoNames: [],
  uploadedVideos: [],
  error: null,
  status: 'idel', //* 'idle' |  'loading' | 'succeeded' | 'failed'
};

const getVideo = createAsyncThunk<
  // Return type of the payload creator
  object | AxiosError,
  // First argument to the payload creator
  string
>('video/getVideo', async (videoName: string) => {
  // Just make the async request here, and return the response.
  // This will automatically dispatch a `pending` action first,
  // and then `fulfilled` or `rejected` actions based on the promise.
  // as needed based on the
  return await axios({
    method: 'GET',
    url: `https://node-file-apis-2.onrender.com/files/${videoName}`,
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
});

export const uploadVideo = createAsyncThunk<
  // Return type of the payload creator
  object | AxiosError,
  // First argument to the payload creator
  FormData
>('audio/uploadVideo', async (videoFile: FormData) => {
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
    data: videoFile,
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
});

const videosSlice = createSlice({
  name: 'video',
  initialState: initialState,
  reducers: {
    addVideo: (state, action: PayloadAction<object>) => {
      state.videos = [...state.videos, action.payload];
    },
    resetVideos: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Use `extraReducers` to handle actions that were generated
    // _outside_ of the slice, such as thunks or in other slices
    builder
      .addCase(getVideo.pending, state => {
        state.status = 'loading';
      })
      // Pass the generated action creators to `.addCase()`
      .addCase(getVideo.fulfilled, (state, action: PayloadAction<object>) => {
        // Same "mutating" update syntax thanks to Immer
        state.status = 'succeeded';
        state.uploadedVideos = [...state.uploadedVideos, action.payload];
      })
      .addCase(
        getVideo.rejected,
        (state, action: AxiosError | string | any) => {
          state.status = 'failed';
          state.error = action.error.message;
        },
      );
    builder
      .addCase(uploadVideo.pending, state => {
        state.status = 'loading';
      })
      // Pass the generated action creators to `.addCase()`
      .addCase(
        uploadVideo.fulfilled,
        (state, action: PayloadAction<object | any>) => {
          // Same "mutating" update syntax thanks to Immer
          const videoObject: VideoProps = {
            description: 'description',
            sources: [
              `https://node-file-apis-2.onrender.com/files/${action.payload.savedFileName}`,
            ],
            subtitle: `subTitle-${moment().unix()}`,
            thumb: 'https://picsum.photos/150/150?image=0',
            title: action.payload.savedFileName,
          };
          state.status = 'succeeded';
          state.videoNames = [...state.videoNames, videoObject];
        },
      )
      .addCase(
        uploadVideo.rejected,
        (state, action: AxiosError | string | any) => {
          state.status = 'failed';
          state.error = action.error.message;
        },
      );
  },
});

export const {addVideo, resetVideos} = videosSlice.actions;
export default videosSlice.reducer;
