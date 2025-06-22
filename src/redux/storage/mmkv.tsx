import {MMKV} from 'react-native-mmkv';
export const storage = new MMKV();

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key: string): string | null {
  try {
    return storage.getString(key) ?? null;
  } catch (error) {
    console.log('loadString Error =>', error);
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key: string, value: string): boolean {
  try {
    storage.set(key, value);
    return true;
  } catch (error) {
    console.log('saveString Error =>', error);
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load<TData>(key: string): TData | null {
  let almostThere: string | null = null;
  try {
    almostThere = loadString(key);
    return JSON.parse(almostThere ?? '') as TData;
  } catch (error) {
    console.log('load Error =>', error);
    return (almostThere as TData) ?? null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(key: string, value: unknown): boolean {
  try {
    saveString(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.log('save Error =>', error);
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): void {
  try {
    storage.delete(key);
  } catch (error) {
    console.log('remove Error =>', error);
  }
}

/**
 * Burn it all to the ground.
 */
export function clear(): void {
  try {
    storage.clearAll();
  } catch (error) {
    console.log('clear Error =>', error);
  }
}
