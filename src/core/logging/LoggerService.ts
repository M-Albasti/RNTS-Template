import {reportErrorToSentry} from '@core/logging/sentryReporting';

const isDev = __DEV__;

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

export const LoggerService = {
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
    console.error(...args);
    reportErrorToSentry(toError(args[0]), {
      loggerContext: 'LoggerService.error',
      data: args.slice(1),
    });
  },
  exception: (error: unknown, context?: Record<string, unknown>) => {
    console.error(error, context);
    reportErrorToSentry(toError(error), {
      loggerContext: 'LoggerService.exception',
      ...(context ?? {}),
    });
  },
};

export const logger = LoggerService;
