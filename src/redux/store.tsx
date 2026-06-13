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
import {save, load, remove, clear} from '@redux/storage/mmkv';
// import {save, load, remove, clear} from '@redux/storage/sqliteStorage';
// import {save, load, remove, clear} from '@redux/storage/asyncStorage';
import {clearSQLiteData} from '@redux/storage/sqlite/init';
import {sqliteMiddleware} from '@redux/storage/sqlite/middleware/sqliteMiddleware';

//* reducers import
import rootReducer from '@redux/reducers';

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

// Create a storage adapter for redux-persist - SQLite kv_store (optional)
// Requires initializeSQLite() before the store hydrates.
// const storage = {
//   setItem: (key: string, value: string) => {
//     save(key, value);
//     return Promise.resolve();
//   },
//   getItem: (key: string) => {
//     const result = load<string>(key);
//     return Promise.resolve(result);
//   },
//   removeItem: (key: string) => {
//     remove(key);
//     return Promise.resolve();
//   },
// };

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

// redux-persist v6 uses `blacklist` (not `blackList`).
// `todos` is persisted in SQLite (see src/redux/storage/sqlite/README.md) — exclude from MMKV.
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['todos'] as string[],
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
    }).concat(sqliteMiddleware),
});

export const persistor = persistStore(store);

// Utility function to clear all persisted data
export const clearAllStorage = () => {
  clear();
  clearSQLiteData();
};
