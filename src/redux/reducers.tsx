//* packages import
import {combineReducers} from 'redux';

//* reducers import
import authReducer from './slices/authSlice';
import videosReducer from './slices/videosSlice';
import audiosReducer from './slices/audiosSlice';
import appSettingsReducer from './slices/appSettingsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  video: videosReducer,
  audio: audiosReducer,
  appSettings: appSettingsReducer,
});

export default rootReducer;
