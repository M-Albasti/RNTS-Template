import axios from 'axios';

/** Lightweight HTTP clients for public Islamic content APIs (no app JWT). */
export const quranHttpClient = axios.create({
  baseURL: 'https://api.alquran.cloud/v1',
  timeout: 20000,
  headers: {Accept: 'application/json'},
});

export const hadithHttpClient = axios.create({
  baseURL: 'https://hadislam.org',
  timeout: 20000,
  headers: {Accept: 'application/json'},
});

/**
 * HisnMuslim JSON files ship with a UTF-8 BOM. Force `responseType: 'text'`
 * so every platform (especially iOS) runs BOM stripping before JSON.parse —
 * otherwise `data['English']` can silently become `[]` and hide categories.
 */
const decodeHisnResponse = (data: unknown): unknown => {
  if (typeof data !== 'string') {
    return data;
  }

  const cleaned = data.replace(/^\uFEFF/, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    return data;
  }
};

export const adhkarHttpClient = axios.create({
  baseURL: 'https://www.hisnmuslim.com/api',
  timeout: 20000,
  // Force text so BOM stripping runs on every platform (iOS may otherwise
  // hand back a failed auto-parse and yield empty categories).
  responseType: 'text',
  headers: {
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (compatible; RNTS-Template/1.0; +https://github.com/M-Albasti/RNTS-Template)',
  },
  transformResponse: [decodeHisnResponse],
});

export const prayerHttpClient = axios.create({
  baseURL: 'https://api.aladhan.com/v1',
  timeout: 20000,
  headers: {Accept: 'application/json'},
});

/** mp3quran.net public API (reciter timing / metadata). */
export const mp3quranHttpClient = axios.create({
  baseURL: 'https://www.mp3quran.net/api/v3',
  timeout: 20000,
  headers: {Accept: 'application/json'},
});
