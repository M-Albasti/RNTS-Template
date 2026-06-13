import {initCrashlytics, recordCrashError} from '@services/firebaseServices/firebaseCrashlyticsService';
import {initRemoteConfig} from '@services/firebaseServices/firebaseRemoteConfigService';
import {trackAppOpen} from '@services/firebaseServices/firebaseUserSync';

/**
 * Initializes Firebase Crashlytics + Remote Config on app startup.
 * Analytics collection starts automatically once google-services / GoogleService-Info are configured.
 */
export const initFirebaseServices = async (): Promise<void> => {
  try {
    await initCrashlytics();
    await initRemoteConfig();
    await trackAppOpen();
  } catch (error) {
    console.log('Firebase services init Error =>', error);
    recordCrashError(error, 'initFirebaseServices');
  }
};

export {
  logAnalyticsEvent,
  logScreenView,
  AnalyticsEvents,
} from '@services/firebaseServices/firebaseAnalyticsService';
export {
  recordCrashError,
  logCrashlytics,
  triggerTestCrash,
} from '@services/firebaseServices/firebaseCrashlyticsService';
export {
  getRemoteConfigValues,
  refreshRemoteConfig,
  getRemoteConfigBoolean,
  getRemoteConfigString,
} from '@services/firebaseServices/firebaseRemoteConfigService';
