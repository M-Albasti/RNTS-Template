//* packages import
import {combineReducers} from 'redux';

//* reducers import
import authReducer from '@redux/slices/authSlice';
import videosReducer from '@redux/slices/videosSlice';
import audiosReducer from '@redux/slices/audiosSlice';
import appSettingsReducer from '@redux/slices/appSettingsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  video: videosReducer,
  audio: audiosReducer,
  appSettings: appSettingsReducer,
});

export default rootReducer;
