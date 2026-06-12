/**
 * Centralized logger — only outputs in development to avoid leaking data in production builds.
 * Replace raw console.log calls gradually; use logger.debug/info/warn/error instead.
 */
const isDev = __DEV__;

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Errors are always logged locally; Sentry captures boundary/service failures separately.
    console.error(...args);
  },
};
