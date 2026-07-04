import type {Breadcrumb, ErrorEvent} from '@sentry/react-native';
import type {Scope} from '@sentry/core';

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

/**
 * Android's native Sentry bridge expects breadcrumb `data` values to be strings.
 * Navigation params, status codes, touch paths, and other JS values often arrive
 * as numbers or nested objects, which triggers:
 * "java.lang.Double cannot be cast to java.lang.String".
 */
export const sanitizeBreadcrumbData = (
  data: Record<string, unknown>,
): Record<string, string> => {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = stringifyValue(value);
  }

  return sanitized;
};

const simplifyTouchBreadcrumbData = (
  data: Record<string, unknown>,
): Record<string, string> => {
  const path = data.path;

  if (Array.isArray(path) && path.length > 0) {
    const root = path[0] as {name?: unknown; file?: unknown};
    const component =
      typeof root?.name === 'string' ? root.name : 'UnknownComponent';
    const file = typeof root?.file === 'string' ? root.file : undefined;

    return {
      component,
      ...(file ? {file} : {}),
      depth: String(path.length),
    };
  }

  if (typeof path === 'string') {
    try {
      const parsed = JSON.parse(path) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return simplifyTouchBreadcrumbData({path: parsed});
      }
    } catch {
      return {path};
    }
  }

  return sanitizeBreadcrumbData(data);
};

export const sanitizeBreadcrumb = (breadcrumb: Breadcrumb): Breadcrumb => {
  const next: Breadcrumb = {...breadcrumb};

  if (next.category != null) {
    next.category = String(next.category);
  }

  if (next.type != null) {
    next.type = String(next.type);
  }

  if (next.message != null) {
    next.message = String(next.message);
  }

  if (next.data === undefined || next.data === null) {
    return next;
  }

  if (typeof next.data !== 'object' || Array.isArray(next.data)) {
    return {
      ...next,
      data: {value: stringifyValue(next.data)},
    };
  }

  const data = next.data as Record<string, unknown>;

  if (next.category === 'touch' && 'path' in data) {
    return {
      ...next,
      data: simplifyTouchBreadcrumbData(data),
    };
  }

  return {
    ...next,
    data: sanitizeBreadcrumbData(data),
  };
};

export const sanitizeSentryEvent = (event: ErrorEvent): ErrorEvent => {
  if (!event.breadcrumbs?.length) {
    return event;
  }

  return {
    ...event,
    breadcrumbs: event.breadcrumbs.map(breadcrumb =>
      sanitizeBreadcrumb(breadcrumb),
    ),
  };
};

/**
 * Scope sync to native happens inside scope.addBreadcrumb, which can run after
 * integrations build breadcrumb payloads. Sanitize again at the scope boundary
 * so every breadcrumb crossing the bridge uses string-only data values.
 */
export const patchScopeNativeBreadcrumbSanitizer = (scope: Scope): void => {
  const original = scope.addBreadcrumb.bind(scope);

  scope.addBreadcrumb = (breadcrumb, maxBreadcrumbs) => {
    return original(
      sanitizeBreadcrumb(breadcrumb as Breadcrumb),
      maxBreadcrumbs,
    );
  };
};
