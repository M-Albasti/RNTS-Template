import {getAnalytics as rnfbGetAnalytics} from '@react-native-firebase/analytics';
import {getCrashlytics as rnfbGetCrashlytics} from '@react-native-firebase/crashlytics';
import {getMessaging as rnfbGetMessaging} from '@react-native-firebase/messaging';
import {getRemoteConfig as rnfbGetRemoteConfig} from '@react-native-firebase/remote-config';

type AnalyticsInstance = ReturnType<typeof rnfbGetAnalytics>;
type CrashlyticsInstance = ReturnType<typeof rnfbGetCrashlytics>;
type MessagingInstance = ReturnType<typeof rnfbGetMessaging>;
type RemoteConfigInstance = ReturnType<typeof rnfbGetRemoteConfig>;

let analyticsInstance: AnalyticsInstance | undefined;
let crashlyticsInstance: CrashlyticsInstance | undefined;
let messagingInstance: MessagingInstance | undefined;
let remoteConfigInstance: RemoteConfigInstance | undefined;

/** Lazily initialized Firebase Analytics instance (safe across Metro reloads). */
export const getFirebaseAnalytics = (): AnalyticsInstance => {
  analyticsInstance ??= rnfbGetAnalytics();
  return analyticsInstance;
};

/** Lazily initialized Firebase Crashlytics instance (safe across Metro reloads). */
export const getFirebaseCrashlytics = (): CrashlyticsInstance => {
  crashlyticsInstance ??= rnfbGetCrashlytics();
  return crashlyticsInstance;
};

/** Lazily initialized Firebase Cloud Messaging instance (safe across Metro reloads). */
export const getFirebaseMessaging = (): MessagingInstance => {
  messagingInstance ??= rnfbGetMessaging();
  return messagingInstance;
};

/** Lazily initialized Firebase Remote Config instance (safe across Metro reloads). */
export const getFirebaseRemoteConfig = (): RemoteConfigInstance => {
  remoteConfigInstance ??= rnfbGetRemoteConfig();
  return remoteConfigInstance;
};
