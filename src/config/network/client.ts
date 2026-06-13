import axios from 'axios';

import {apiConfig} from '@config/apiConfig';
import {getAccessToken} from '@config/network/tokenStorage';
import {normalizeApiError} from '@config/network/apiError';

/** Shared Axios client for app REST APIs (auth, feed, dashboard, …). */
export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeoutMs,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(normalizeApiError(error)),
);
