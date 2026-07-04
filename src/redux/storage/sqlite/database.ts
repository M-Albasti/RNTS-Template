/**
 * SQLite database connection (singleton).
 *
 * WHAT THIS FILE DOES
 * -------------------
 * Opens exactly ONE database file on the device: `rnts_app.sqlite`.
 * Every other file in this folder calls `getDatabase()` to run SQL.
 *
 * KEY CONCEPTS FOR BEGINNERS
 * --------------------------
 * - SQLite = a small SQL database stored as a single file on the phone.
 * - `open({ name })` creates/opens that file (via @op-engineering/op-sqlite).
 * - `executeSync(sql, params?)` runs SQL immediately on the JS thread.
 * - `?` placeholders in SQL are filled by the params array (prevents SQL injection).
 * - PRAGMA = SQLite configuration commands (not data queries).
 *
 * @see README.md in this folder for the full architecture guide.
 */
import {open, type DB} from '@op-engineering/op-sqlite';

import {SQLITE_DB_NAME} from './schema';

/** Holds the open connection after `openDatabase()` — null until first open. */
let database: DB | null = null;

/**
 * Returns the live DB connection.
 * Throws if the app has not called `initializeSQLite()` yet.
 */
export const getDatabase = (): DB => {
  if (!database) {
    throw new Error(
      'SQLite is not initialized. Call initializeSQLite() before using the database.',
    );
  }
  return database;
};

/** True when `openDatabase()` has been called and the connection is still open. */
export const isDatabaseOpen = (): boolean => database !== null;

/**
 * Opens the database file (or reuses an existing connection).
 * Also applies performance/safety PRAGMA settings once.
 */
export const openDatabase = (): DB => {
  if (database) {
    return database;
  }

  // Creates `rnts_app.sqlite` in the platform default database directory.
  database = open({name: SQLITE_DB_NAME});

  // Enforce foreign-key constraints if we add related tables later.
  database.executeSync('PRAGMA foreign_keys = ON;');

  // WAL = Write-Ahead Logging. Faster concurrent reads/writes on mobile.
  database.executeSync('PRAGMA journal_mode = WAL;');

  return database;
};

/** Closes the connection but keeps the file on disk. */
export const closeDatabase = (): void => {
  if (!database) {
    return;
  }

  database.close();
  database = null;
};

/**
 * Deletes the database file from disk entirely.
 * Used by `resetSQLiteDatabase()` for a full factory reset of local SQL data.
 */
export const deleteDatabaseFile = (): void => {
  if (database) {
    database.delete();
    database = null;
    return;
  }

  // File exists but connection was closed — open temporarily just to delete.
  const tempDb = open({name: SQLITE_DB_NAME});
  tempDb.delete();
};

/**
 * Runs multiple SQL statements atomically.
 * If any statement fails, ALL changes are rolled back (nothing partial is saved).
 *
 * Example:
 *   runInTransaction(db => {
 *     db.executeSync('DELETE FROM todos');
 *     db.executeSync('INSERT INTO todos ...', [...]);
 *   });
 */
export const runInTransaction = (fn: (db: DB) => void): void => {
  const db = getDatabase();
  db.executeSync('BEGIN IMMEDIATE');

  try {
    fn(db);
    db.executeSync('COMMIT');
  } catch (error) {
    db.executeSync('ROLLBACK');
    throw error;
  }
};
