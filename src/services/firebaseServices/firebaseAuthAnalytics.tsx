import {
  AnalyticsEvents,
  logAnalyticsEvent,
} from '@services/firebaseServices/firebaseAnalyticsService';
import {recordCrashError} from '@services/firebaseServices/firebaseCrashlyticsService';

import type {LoginTypes} from '@Types/loginTypes';

export const trackLoginSuccess = async (method: LoginTypes): Promise<void> => {
  await logAnalyticsEvent(AnalyticsEvents.loginSuccess, {method});
};

export const trackLoginFailure = async (
  method: LoginTypes,
  reason: string,
): Promise<void> => {
  await logAnalyticsEvent(AnalyticsEvents.loginFailed, {
    method,
    reason: reason.slice(0, 100),
  });
};

export const trackRegisterSuccess = async (method: LoginTypes): Promise<void> => {
  await logAnalyticsEvent(AnalyticsEvents.registerSuccess, {method});
};

export const trackRegisterFailure = async (
  method: LoginTypes,
  reason: string,
): Promise<void> => {
  await logAnalyticsEvent(AnalyticsEvents.registerFailed, {
    method,
    reason: reason.slice(0, 100),
  });
};

export const trackLogout = async (method: LoginTypes): Promise<void> => {
  await logAnalyticsEvent(AnalyticsEvents.logout, {method});
};

export const trackApiError = (
  endpoint: string,
  status: number | undefined,
  message: string,
): void => {
  if (status && status < 500) {
    return;
  }

  recordCrashError(
    new Error(message),
    `api:${endpoint}:${status ?? 'unknown'}`,
  );
};
