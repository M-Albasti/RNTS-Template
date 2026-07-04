/**
 * Generic JSON blob storage per Redux slice key.
 *
 * Example: setSliceSnapshot('wallet_meta', { lastTab: 'cards' })
 *
 * Todos meta currently uses todosRepository.saveTodosMeta instead,
 * but this repository is ready for other features.
 */
import {getDatabase} from '../database';

const nowIso = (): string => new Date().toISOString();

export const getSliceSnapshot = <TData>(sliceKey: string): TData | null => {
  try {
    const result = getDatabase().executeSync(
      'SELECT payload FROM slice_snapshots WHERE slice_key = ?',
      [sliceKey],
    );
    const payload = result.rows[0]?.payload;
    if (typeof payload !== 'string') {
      return null;
    }
    return JSON.parse(payload) as TData;
  } catch (error) {
    console.log('SQLite getSliceSnapshot Error =>', error, sliceKey);
    return null;
  }
};

export const setSliceSnapshot = (sliceKey: string, payload: unknown): boolean => {
  try {
    getDatabase().executeSync(
      `INSERT INTO slice_snapshots (slice_key, payload, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(slice_key) DO UPDATE SET
         payload = excluded.payload,
         updated_at = excluded.updated_at`,
      [sliceKey, JSON.stringify(payload), nowIso()],
    );
    return true;
  } catch (error) {
    console.log('SQLite setSliceSnapshot Error =>', error, sliceKey);
    return false;
  }
};

export const removeSliceSnapshot = (sliceKey: string): void => {
  try {
    getDatabase().executeSync('DELETE FROM slice_snapshots WHERE slice_key = ?', [
      sliceKey,
    ]);
  } catch (error) {
    console.log('SQLite removeSliceSnapshot Error =>', error, sliceKey);
  }
};

export const clearSliceSnapshots = (): void => {
  try {
    getDatabase().executeSync('DELETE FROM slice_snapshots');
  } catch (error) {
    console.log('SQLite clearSliceSnapshots Error =>', error);
  }
};
