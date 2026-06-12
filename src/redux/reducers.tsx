//* packages import
import {combineReducers} from 'redux';

//* reducers import
import authReducer from '@redux/slices/authSlice';
import videosReducer from '@redux/slices/videosSlice';
import audiosReducer from '@redux/slices/audiosSlice';
import appSettingsReducer from '@redux/slices/appSettingsSlice';
import postsReducer from '@redux/slices/postsSlice';
import todosReducer from '@redux/slices/todosSlice';
import chatReducer from '@redux/slices/chatSlice';
import walletReducer from '@redux/slices/walletSlice';
import galleryReducer from '@redux/slices/gallerySlice';
import gameReducer from '@redux/slices/gameSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  video: videosReducer,
  audio: audiosReducer,
  appSettings: appSettingsReducer,
  posts: postsReducer,
  todos: todosReducer,
  chat: chatReducer,
  wallet: walletReducer,
  gallery: galleryReducer,
  game: gameReducer,
});

export default rootReducer;
