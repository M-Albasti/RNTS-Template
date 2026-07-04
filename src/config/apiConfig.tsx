import {APP_ENV, API_BASE_URL, API_USE_MOCKS, MEDIA_API_BASE_URL} from '@env';

const parseBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
};

/** Central API configuration — base URLs, timeouts, and mock toggle. */
export const apiConfig = {
  env: APP_ENV,
  baseURL: API_BASE_URL || 'https://api.rnts-template.local/v1',
  mediaBaseURL:
    MEDIA_API_BASE_URL || 'https://node-file-apis-2.onrender.com',
  timeoutMs: 15_000,
  /** When true, axios-mock-adapter serves responses for core app APIs. */
  useMocks: parseBool(API_USE_MOCKS, APP_ENV === 'development'),
} as const;

export type ApiConfig = typeof apiConfig;
