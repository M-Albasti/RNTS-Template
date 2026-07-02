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
import deliveryReducer from '@redux/slices/deliverySlice';
import marketplaceReducer from '@redux/slices/marketplaceSlice';
import wordPuzzleReducer from '@redux/slices/wordPuzzleSlice';
import islamicReducer from '@redux/slices/islamicSlice';

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
  delivery: deliveryReducer,
  marketplace: marketplaceReducer,
  wordPuzzle: wordPuzzleReducer,
  islamic: islamicReducer,
});

export default rootReducer;
