import axios from 'axios';

import {apiConfig} from '@config/apiConfig';
import {normalizeApiError} from '@config/network/apiError';

/** Axios client for file upload / media endpoints (separate host from main API). */
export const mediaClient = axios.create({
  baseURL: apiConfig.mediaBaseURL,
  timeout: apiConfig.timeoutMs,
});

mediaClient.interceptors.response.use(
  response => response,
  error => Promise.reject(normalizeApiError(error)),
);
