import axios from 'axios';

import {apiConfig} from '@config/apiConfig';
import {wireHttpClientForSentry} from '@core/http/HttpClientService';
import {normalizeApiError} from '@config/network/apiError';

/** Axios client for file upload / media endpoints (separate host from main API). */
export const mediaClient = axios.create({
  baseURL: apiConfig.mediaBaseURL,
  timeout: apiConfig.timeoutMs,
});

wireHttpClientForSentry(mediaClient);

mediaClient.interceptors.response.use(
  response => response,
  error => Promise.reject(normalizeApiError(error)),
);
