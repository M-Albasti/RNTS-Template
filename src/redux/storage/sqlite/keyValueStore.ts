/**
 * Key-value storage on top of the `kv_store` table.
 *
 * Think of this as a SQLite-backed Map<string, string>.
 * `kvGetJson` / `kvSetJson` add JSON serialization on top.
 *
 * Used by:
 * - `sqliteStorage.tsx` (optional redux-persist backend)
 * - Any feature that needs simple offline key-value data
 */
import {getDatabase} from './database';

const nowIso = (): string => new Date().toISOString();

/** Read a raw string value for `key`, or null if missing / error. */
export const kvGetString = (key: string): string | null => {
  try {
    const result = getDatabase().executeSync(
      'SELECT value FROM kv_store WHERE key = ?',
      [key],
    );
    const value = result.rows[0]?.value;
    return typeof value === 'string' ? value : null;
  } catch (error) {
    console.log('SQLite kvGetString Error =>', error, key);
    return null;
  }
};

/** Insert or update a string value (upsert via ON CONFLICT). */
export const kvSetString = (key: string, value: string): boolean => {
  try {
    getDatabase().executeSync(
      `INSERT INTO kv_store (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         updated_at = excluded.updated_at`,
      [key, value, nowIso()],
    );
    return true;
  } catch (error) {
    console.log('SQLite kvSetString Error =>', error, key);
    return false;
  }
};

/** Delete one key. */
export const kvRemove = (key: string): void => {
  try {
    getDatabase().executeSync('DELETE FROM kv_store WHERE key = ?', [key]);
  } catch (error) {
    console.log('SQLite kvRemove Error =>', error, key);
  }
};

/** Delete every row in kv_store (does not drop the table). */
export const kvClear = (): void => {
  try {
    getDatabase().executeSync('DELETE FROM kv_store');
  } catch (error) {
    console.log('SQLite kvClear Error =>', error);
  }
};

/** List all keys (sorted alphabetically). */
export const kvGetAllKeys = (): string[] => {
  try {
    const result = getDatabase().executeSync(
      'SELECT key FROM kv_store ORDER BY key ASC',
    );
    return result.rows
      .map(row => row.key)
      .filter((key): key is string => typeof key === 'string');
  } catch (error) {
    console.log('SQLite kvGetAllKeys Error =>', error);
    return [];
  }
};

/** Parse stored JSON into a typed object. */
export const kvGetJson = <TData>(key: string): TData | null => {
  const raw = kvGetString(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TData;
  } catch (error) {
    console.log('SQLite kvGetJson Error =>', error, key);
    return null;
  }
};

/** Stringify and store an object. */
export const kvSetJson = (key: string, value: unknown): boolean => {
  try {
    return kvSetString(key, JSON.stringify(value));
  } catch (error) {
    console.log('SQLite kvSetJson Error =>', error, key);
    return false;
  }
};
