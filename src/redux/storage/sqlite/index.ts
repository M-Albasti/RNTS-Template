/**
 * Public exports for the SQLite module.
 *
 * Prefer importing from here:
 *   import { bootstrapSQLite, getAllTodos } from '@redux/storage/sqlite';
 *
 * Full beginner guide: see ./README.md in this folder.
 */
export {
  bootstrapSQLite,
  clearSQLiteData,
  closeSQLite,
  getCurrentSchemaVersion,
  hydrateReduxFromSQLite,
  initializeSQLite,
  isSQLiteReady,
  resetSQLiteDatabase,
} from './init';

export {getDatabase, isDatabaseOpen, runInTransaction} from './database';
export {
  kvClear,
  kvGetAllKeys,
  kvGetJson,
  kvGetString,
  kvRemove,
  kvSetJson,
  kvSetString,
} from './keyValueStore';
export {
  deleteTodo,
  getAllTodos,
  replaceAllTodos,
  upsertTodo,
} from './repositories/todosRepository';
export {
  getSliceSnapshot,
  removeSliceSnapshot,
  setSliceSnapshot,
} from './repositories/sliceSnapshotRepository';
export {loadTodosStateFromSQLite, saveTodosStateToSQLite} from './sync/todosSync';
export {sqliteMiddleware} from './middleware/sqliteMiddleware';

export type {PersistedTodosMeta, SqliteMigration, TodoRow} from './types';
