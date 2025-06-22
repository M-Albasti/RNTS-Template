//* packages import
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

//* storage import
import {save, load, remove, clear} from './storage/mmkv';
// import {save, load, remove, clear} from './storage/asyncStorage';

//* reducers import
import rootReducer from './reducers';

// Create a storage adapter for redux-persist - MMKV (Current)
const storage = {
  setItem: (key: string, value: string) => {
    save(key, value);
    return Promise.resolve();
  },
  getItem: (key: string) => {
    const result = load<string>(key);
    return Promise.resolve(result);
  },
  removeItem: (key: string) => {
    remove(key);
    return Promise.resolve();
  },
};

// Create a storage adapter for redux-persist - AsyncStorage (Commented for easy reversion)
// const storage = {
//   setItem: async (key: string, value: string) => {
//     await save(key, value);
//   },
//   getItem: async (key: string) => {
//     const result = await load<string>(key);
//     return result;
//   },
//   removeItem: async (key: string) => {
//     await remove(key);
//   },
// };

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blackList: [],
};

// Activate the App storage (AsyncStorage) for the reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Automatically adds the thunk middleware and the Redux DevTools extension
export const store = configureStore({
  // Can automatically calls `combineReducers` but persist storage needed
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Utility function to clear all persisted data
export const clearAllStorage = () => {
  clear();
};
