import {
  crash,
  log,
  recordError,
  setCrashlyticsCollectionEnabled,
  setUserId,
} from '@react-native-firebase/crashlytics';

import {getFirebaseCrashlytics} from '@config/firebaseInstances';

export const initCrashlytics = async (): Promise<void> => {
  try {
    await setCrashlyticsCollectionEnabled(getFirebaseCrashlytics(), true);
  } catch (error) {
    console.log('Firebase Crashlytics init Error =>', error);
  }
};

export const recordCrashError = (error: unknown, context?: string): void => {
  try {
    if (context) {
      log(getFirebaseCrashlytics(), context);
    }

    if (error instanceof Error) {
      recordError(getFirebaseCrashlytics(), error);
      return;
    }

    recordError(getFirebaseCrashlytics(), new Error(String(error)));
  } catch (writeError) {
    console.log('Firebase Crashlytics recordError Error =>', writeError);
  }
};

export const logCrashlytics = (message: string): void => {
  try {
    log(getFirebaseCrashlytics(), message);
  } catch (error) {
    console.log('Firebase Crashlytics log Error =>', error);
  }
};

export const setCrashlyticsUserId = (userId: string): void => {
  try {
    void setUserId(getFirebaseCrashlytics(), userId);
  } catch (error) {
    console.log('Firebase Crashlytics setUserId Error =>', error);
  }
};

/** Dev-only helper to verify Crashlytics wiring (shows in Firebase after ~5 min). */
export const triggerTestCrash = (): void => {
  crash(getFirebaseCrashlytics());
};
