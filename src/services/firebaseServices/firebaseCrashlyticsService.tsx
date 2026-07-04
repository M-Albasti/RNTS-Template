import crashlytics from '@react-native-firebase/crashlytics';

export const initCrashlytics = async (): Promise<void> => {
  try {
    await crashlytics().setCrashlyticsCollectionEnabled(true);
  } catch (error) {
    console.log('Firebase Crashlytics init Error =>', error);
  }
};

export const recordCrashError = (error: unknown, context?: string): void => {
  try {
    if (context) {
      crashlytics().log(context);
    }

    if (error instanceof Error) {
      crashlytics().recordError(error);
      return;
    }

    crashlytics().recordError(new Error(String(error)));
  } catch (recordError) {
    console.log('Firebase Crashlytics recordError Error =>', recordError);
  }
};

export const logCrashlytics = (message: string): void => {
  try {
    crashlytics().log(message);
  } catch (error) {
    console.log('Firebase Crashlytics log Error =>', error);
  }
};

export const setCrashlyticsUserId = (userId: string): void => {
  try {
    crashlytics().setUserId(userId);
  } catch (error) {
    console.log('Firebase Crashlytics setUserId Error =>', error);
  }
};

/** Dev-only helper to verify Crashlytics wiring (shows in Firebase after ~5 min). */
export const triggerTestCrash = (): void => {
  crashlytics().crash();
};
