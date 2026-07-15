import {initCrashlytics, recordCrashError} from '@services/firebaseServices/firebaseCrashlyticsService';
import {initFirebaseMessaging} from '@services/firebaseServices/firebaseMessagingService';
import {initRemoteConfig} from '@services/firebaseServices/firebaseRemoteConfigService';
import {trackAppOpen} from '@services/firebaseServices/firebaseUserSync';

declare global {
  // eslint-disable-next-line no-var
  var __RNTS_FIREBASE_SERVICES_INIT__: boolean | undefined;
}

/**
 * Initializes Firebase Crashlytics, Remote Config, and Cloud Messaging on app startup.
 * Analytics collection starts automatically once google-services / GoogleService-Info are configured.
 */
export const initFirebaseServices = async (): Promise<void> => {
  if (globalThis.__RNTS_FIREBASE_SERVICES_INIT__) {
    return;
  }

  try {
    await initCrashlytics();
    await initRemoteConfig();
    await initFirebaseMessaging();
    await trackAppOpen();
    globalThis.__RNTS_FIREBASE_SERVICES_INIT__ = true;
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
export {
  FCM_CHANNEL_ID,
  getFirebaseMessagingToken,
  initFirebaseMessaging,
  registerFirebasePushNotifications,
  requestFirebasePushPermission,
} from '@services/firebaseServices/firebaseMessagingService';
