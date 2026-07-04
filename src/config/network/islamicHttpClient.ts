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

export const adhkarHttpClient = axios.create({
  baseURL: 'https://www.hisnmuslim.com/api',
  timeout: 20000,
  headers: {Accept: 'application/json'},
});

export const prayerHttpClient = axios.create({
  baseURL: 'https://api.aladhan.com/v1',
  timeout: 20000,
  headers: {Accept: 'application/json'},
});
