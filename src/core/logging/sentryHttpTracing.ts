import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import * as Sentry from '@sentry/react-native';

import {reportErrorToSentry} from '@core/logging/sentryReporting';

const MAX_VALUE_LENGTH = 16384;

const REDACTED_HEADER_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-client-secret',
  'client-secret',
]);

type SentryAxiosConfig = InternalAxiosRequestConfig & {
  __sentryStartedAt?: number;
  __sentrySpan?: ReturnType<typeof Sentry.startInactiveSpan>;
};

export type StandaloneHttpCaptureInput = {
  method: string;
  url: string;
  requestHeaders?: Record<string, unknown>;
  status?: number;
  error?: unknown;
  responseNote?: string;
};

const truncate = (value: string): string =>
  value.length > MAX_VALUE_LENGTH
    ? `${value.slice(0, MAX_VALUE_LENGTH)}…[truncated]`
    : value;

const safeJsonStringify = (value: unknown): string => {
  try {
    return truncate(JSON.stringify(value));
  } catch {
    return truncate(String(value));
  }
};

const redactHeaders = (
  headers: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined => {
  if (!headers) {
    return headers;
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(headers)) {
    redacted[key] = REDACTED_HEADER_KEYS.has(key.toLowerCase())
      ? '[REDACTED]'
      : value;
  }
  return redacted;
};

const serializeBody = (body: unknown): unknown => {
  if (body == null) {
    return body;
  }

  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return {_type: 'FormData', note: 'multipart — file bytes omitted'};
  }

  if (body instanceof ArrayBuffer) {
    return {_type: 'ArrayBuffer', byteLength: body.byteLength};
  }

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return {_type: 'Blob', size: body.size};
  }

  if (typeof body === 'string') {
    return truncate(body);
  }

  return body;
};

const resolveFullUrl = (config: InternalAxiosRequestConfig): string => {
  const url = config.url ?? '';
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const base = (config.baseURL ?? '').replace(/\/$/, '');
  const path = url.replace(/^\//, '');
  return base ? `${base}/${path}` : path;
};

const buildRequestSnapshot = (config: InternalAxiosRequestConfig) => ({
  method: (config.method ?? 'get').toUpperCase(),
  url: resolveFullUrl(config),
  headers: redactHeaders(config.headers as Record<string, unknown> | undefined),
  params: config.params,
  body: serializeBody(config.data),
  timeout: config.timeout,
  responseType: config.responseType,
});

const buildResponseSnapshot = (
  response: AxiosResponse | undefined,
  status?: number,
  error?: unknown,
) => {
  if (response) {
    return {
      status: response.status,
      statusText: response.statusText,
      headers: redactHeaders(response.headers as Record<string, unknown>),
      body: serializeBody(response.data),
    };
  }

  return {
    status: status ?? null,
    statusText: error instanceof Error ? error.message : undefined,
    headers: undefined,
    body: undefined,
  };
};

const isHardHttpFailure = (status: number | undefined, error?: unknown): boolean =>
  !status || status >= 500 || Boolean(error && !status);

export const startSentryHttpSpan = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const sentryConfig = config as SentryAxiosConfig;
  sentryConfig.__sentryStartedAt = Date.now();

  if (!Sentry.getClient()) {
    return config;
  }

  const method = (config.method ?? 'get').toUpperCase();
  const url = resolveFullUrl(config);

  sentryConfig.__sentrySpan = Sentry.startInactiveSpan({
    op: 'http.client',
    name: `${method} ${url}`,
    attributes: {
      'http.request.method': method,
      'http.url': url,
    },
  });

  return config;
};

export const finishSentryHttpSpan = (
  config: InternalAxiosRequestConfig | undefined,
  status?: number,
  error?: unknown,
  response?: AxiosResponse,
): void => {
  if (!config) {
    return;
  }

  const sentryConfig = config as SentryAxiosConfig;
  const startedAt = sentryConfig.__sentryStartedAt ?? Date.now();
  const durationMs = Date.now() - startedAt;
  const request = buildRequestSnapshot(config);
  const responseSnapshot = buildResponseSnapshot(response, status, error);
  const payload = {
    request,
    response: responseSnapshot,
    durationMs,
  };

  Sentry.addBreadcrumb({
    category: 'http',
    type: 'http',
    level: isHardHttpFailure(responseSnapshot.status ?? status, error)
      ? 'error'
      : 'info',
    message: `${request.method} ${request.url}`,
    data: payload as Record<string, unknown>,
  });

  Sentry.logger.info('HTTP client request', payload);

  const span = sentryConfig.__sentrySpan;
  if (span) {
    span.setAttribute('http.request.headers', safeJsonStringify(request.headers));
    span.setAttribute('http.request.body', safeJsonStringify(request.body));
    span.setAttribute(
      'http.response.status_code',
      responseSnapshot.status ?? status ?? 0,
    );
    span.setAttribute('http.response.body', safeJsonStringify(responseSnapshot.body));
    span.setAttribute('http.duration_ms', durationMs);
    span.end();
    sentryConfig.__sentrySpan = undefined;
  }

  if (isHardHttpFailure(responseSnapshot.status ?? status, error)) {
    reportErrorToSentry(error ?? new Error(`${request.method} ${request.url} failed`), {
      http: payload,
    });
  }
};

export const captureSentryStandaloneHttpRequest = ({
  method,
  url,
  requestHeaders,
  status,
  error,
  responseNote,
}: StandaloneHttpCaptureInput): void => {
  const payload = {
    request: {
      method: method.toUpperCase(),
      url,
      headers: redactHeaders(requestHeaders),
    },
    response: {
      status: status ?? null,
      note: responseNote,
    },
    durationMs: null,
  };

  Sentry.addBreadcrumb({
    category: 'http',
    type: 'http',
    level: error || (status != null && status >= 500) ? 'error' : 'info',
    message: `${method.toUpperCase()} ${url}`,
    data: payload as Record<string, unknown>,
  });

  Sentry.logger.info('HTTP client request', payload);

  if (error || (status != null && status >= 500)) {
    reportErrorToSentry(error ?? new Error(`${method.toUpperCase()} ${url} failed`), {
      http: payload,
    });
  }
};

export const wireAxiosForSentry = (client: AxiosInstance): AxiosInstance => {
  client.interceptors.request.use(
    config => startSentryHttpSpan(config),
    (requestError: AxiosError) => {
      if (requestError.config) {
        finishSentryHttpSpan(requestError.config, undefined, requestError);
      }
      return Promise.reject(requestError);
    },
  );

  client.interceptors.response.use(
    response => {
      finishSentryHttpSpan(response.config, response.status, undefined, response);
      return response;
    },
    (responseError: AxiosError) => {
      finishSentryHttpSpan(
        responseError.config,
        responseError.response?.status,
        responseError,
        responseError.response,
      );
      return Promise.reject(responseError);
    },
  );

  return client;
};
