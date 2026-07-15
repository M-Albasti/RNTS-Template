import {getAnalytics, logEvent, setUserId, setUserProperty} from '@react-native-firebase/analytics';

import {getFirebaseAnalytics} from '@config/firebaseInstances';

export const logAnalyticsEvent = (
  name: string,
  params?: Record<string, string | number | boolean>,
): void => {
  Promise.resolve(logEvent(getFirebaseAnalytics(), name, params)).catch(error => {
    console.log('Firebase Analytics logEvent Error =>', error);
  });
};

export const logScreenView = (screenName: string, screenClass?: string): void => {
  Promise.resolve(
    logEvent(getFirebaseAnalytics(), 'screen_view', {
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    }),
  ).catch(error => {
    console.log('Firebase Analytics logScreenView Error =>', error);
  });
};

export const setAnalyticsUserId = async (userId: string | null): Promise<void> => {
  try {
    await setUserId(getFirebaseAnalytics(), userId);
  } catch (error) {
    console.log('Firebase Analytics setUserId Error =>', error);
  }
};

export const setAnalyticsUserProperty = async (
  name: string,
  value: string | null,
): Promise<void> => {
  try {
    await setUserProperty(getFirebaseAnalytics(), name, value);
  } catch (error) {
    console.log('Firebase Analytics setUserProperty Error =>', error);
  }
};

/** Common app events — reuse these names in Firebase Analytics dashboard. */
export const AnalyticsEvents = {
  appOpen: 'app_open',
  loginSuccess: 'login_success',
  loginFailed: 'login_failed',
  registerSuccess: 'register_success',
  registerFailed: 'register_failed',
  logout: 'logout',
  cameraSnapCaptured: 'camera_snap_captured',
  cameraQrScanned: 'camera_qr_scanned',
  cameraBarcodeScanned: 'camera_barcode_scanned',
  cameraFilterChanged: 'camera_filter_changed',
} as const;
