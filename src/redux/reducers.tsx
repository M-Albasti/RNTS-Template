import {combineReducers} from 'redux';

import authReducer from './slices/authSlice';
import videosReducer from './slices/videosSlice';
import audiosReducer from './slices/audiosSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  video: videosReducer,
  audio: audiosReducer,
});

export default rootReducer;
