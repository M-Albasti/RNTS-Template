import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blackList: [],
};

// Activate the App storage (AsyncStorage) for the reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Automatically adds the thunk middleware and the Redux DevTools extension
export const store = configureStore({
  // Can automatically calls `combineReducers` but persist storage needed 
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
