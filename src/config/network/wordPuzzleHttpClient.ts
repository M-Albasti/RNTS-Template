import axios from 'axios';

import {wireHttpClientForSentry} from '@core/http/HttpClientService';

export const islamicQuizClient = axios.create({
  baseURL: 'https://islamicquiz.i8x.net/api',
  timeout: 20000,
});

export const englishRiddlesClient = axios.create({
  baseURL: 'https://riddles-api-eight.vercel.app',
  timeout: 20000,
});

export const quranCloudClient = axios.create({
  baseURL: 'https://api.alquran.cloud/v1',
  timeout: 20000,
});

const wordPuzzleHttpClients = [
  islamicQuizClient,
  englishRiddlesClient,
  quranCloudClient,
];

wordPuzzleHttpClients.forEach(wireHttpClientForSentry);
