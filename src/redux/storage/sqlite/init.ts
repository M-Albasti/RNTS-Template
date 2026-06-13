/**
 * App lifecycle entry points for SQLite.
 *
 * Call `bootstrapSQLite` once when the app starts (see App.tsx).
 * After that, todo changes auto-save via sqliteMiddleware in store.tsx.
 */
import type {Dispatch, UnknownAction} from '@reduxjs/toolkit';

import type {RootState} from '@Types/rootState';

import {
  closeDatabase,
  deleteDatabaseFile,
  isDatabaseOpen,
  openDatabase,
} from './database';
import {kvClear} from './keyValueStore';
import {getCurrentSchemaVersion, runMigrations} from './migrationRunner';
import {clearSliceSnapshots} from './repositories/sliceSnapshotRepository';
import {clearTodosData} from './repositories/todosRepository';
import {hydrateReduxFromSQLite} from './sync/hydrateFromSQLite';

/** Prevents double-init if initializeSQLite is called more than once. */
let initialized = false;

/** Step 1: open file + create tables. Safe to call multiple times (no-op after first). */
export const initializeSQLite = (): void => {
  if (initialized) {
    return;
  }

  openDatabase();
  runMigrations();
  initialized = true;
};

/** True after initializeSQLite completed AND connection is still open. */
export const isSQLiteReady = (): boolean => initialized && isDatabaseOpen();

/**
 * Full startup sequence used by App.tsx:
 * 1. initializeSQLite()
 * 2. hydrateReduxFromSQLite() — load todos OR seed DB from Redux defaults
 */
export const bootstrapSQLite = (
  dispatch: Dispatch<UnknownAction>,
  getState: () => RootState,
): void => {
  initializeSQLite();
  hydrateReduxFromSQLite(dispatch, getState);
};

/** Wipes all data rows but keeps table structure. Called from clearAllStorage(). */
export const clearSQLiteData = (): void => {
  if (!isDatabaseOpen()) {
    openDatabase();
    runMigrations();
  }

  clearTodosData();
  clearSliceSnapshots();
  kvClear();
};

/** Deletes the database file from disk. Call bootstrapSQLite again to recreate. */
export const resetSQLiteDatabase = (): void => {
  closeDatabase();
  deleteDatabaseFile();
  initialized = false;
};

/** Closes connection without deleting file. Rarely needed in mobile apps. */
export const closeSQLite = (): void => {
  closeDatabase();
  initialized = false;
};

export {getCurrentSchemaVersion, hydrateReduxFromSQLite};
