import analytics from '@react-native-firebase/analytics';

export const logAnalyticsEvent = async (
  name: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> => {
  try {
    await analytics().logEvent(name, params);
  } catch (error) {
    console.log('Firebase Analytics logEvent Error =>', error);
  }
};

export const logScreenView = async (
  screenName: string,
  screenClass?: string,
): Promise<void> => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  } catch (error) {
    console.log('Firebase Analytics logScreenView Error =>', error);
  }
};

export const setAnalyticsUserId = async (userId: string | null): Promise<void> => {
  try {
    await analytics().setUserId(userId);
  } catch (error) {
    console.log('Firebase Analytics setUserId Error =>', error);
  }
};

export const setAnalyticsUserProperty = async (
  name: string,
  value: string | null,
): Promise<void> => {
  try {
    await analytics().setUserProperty(name, value);
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
