/**
 * MMKV-compatible storage API backed by SQLite `kv_store` table.
 *
 * Same function names as mmkv.tsx so you can swap redux-persist backends
 * by changing one import in store.tsx.
 *
 * REQUIREMENT: call initializeSQLite() before any read/write.
 *
 * @see sqlite/README.md
 */
import {isEmpty} from 'lodash';

import {
  kvClear,
  kvGetString,
  kvRemove,
  kvSetJson,
  kvSetString,
} from './sqlite/keyValueStore';

export function loadString(key: string): string | null {
  return kvGetString(key);
}

export function saveString(key: string, value: string): boolean {
  return kvSetString(key, value);
}

export function load<TData>(key: string): TData | null {
  try {
    const value = loadString(key);
    if (!value || isEmpty(value)) {
      return null;
    }
    return JSON.parse(value) as TData;
  } catch (error) {
    console.log('SQLite storage load Error =>', error, key);
    return null;
  }
}

export function save(key: string, value: unknown): boolean {
  return kvSetJson(key, value);
}

export function remove(key: string): void {
  kvRemove(key);
}

export function clear(): void {
  kvClear();
}
