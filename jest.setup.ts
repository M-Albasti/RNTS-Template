/**
 * Jest setup — mocks native modules and ESM-only deps so App smoke tests run in Node.
 * @env is resolved via babel module-resolver alias in test mode (see babel.config.js).
 */

jest.mock('@config/sentryConfig', () => ({}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  getClient: jest.fn(() => null),
  getGlobalScope: jest.fn(() => ({addEventProcessor: jest.fn()})),
  getIsolationScope: jest.fn(() => ({addEventProcessor: jest.fn()})),
  wrap: (component: unknown) => component,
  mobileReplayIntegration: jest.fn(() => ({})),
  feedbackIntegration: jest.fn(() => ({})),
  reactNavigationIntegration: jest.fn(() => ({})),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    NativeViewGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: require('react-native').FlatList,
    gestureHandlerRootHOC: (c: unknown) => c,
    Directions: {},
  };
});

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(() => false),
    getAllKeys: jest.fn(() => []),
    clearAll: jest.fn(),
  })),
  MMKV: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  getApp: jest.fn(() => ({
    analytics: jest.fn(),
    crashlytics: jest.fn(),
    messaging: jest.fn(),
    remoteConfig: jest.fn(),
  })),
  getApps: jest.fn(() => []),
}));

jest.mock('@react-native-firebase/messaging', () => {
  const messagingInstance = {};

  return {
    __esModule: true,
    AuthorizationStatus: {
      NOT_DETERMINED: -1,
      DENIED: 0,
      AUTHORIZED: 1,
      PROVISIONAL: 2,
      EPHEMERAL: 3,
    },
    getMessaging: jest.fn(() => messagingInstance),
    setBackgroundMessageHandler: jest.fn(),
    getToken: jest.fn(async () => 'test-fcm-token'),
    requestPermission: jest.fn(async () => 1),
    hasPermission: jest.fn(async () => 1),
    deleteToken: jest.fn(async () => undefined),
    isDeviceRegisteredForRemoteMessages: jest.fn(() => true),
    registerDeviceForRemoteMessages: jest.fn(async () => undefined),
    onMessage: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    onTokenRefresh: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(async () => null),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
  };
});

jest.mock('@react-native-firebase/auth', () => {
  const authInstance = {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(() => jest.fn()),
    currentUser: null,
    settings: {},
  };

  return {
    __esModule: true,
    getAuth: jest.fn(() => authInstance),
    GoogleAuthProvider: {credential: jest.fn()},
    AppleAuthProvider: {credential: jest.fn()},
    FacebookAuthProvider: {credential: jest.fn()},
    PhoneAuthProvider: {credential: jest.fn()},
    signInWithCredential: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPhoneNumber: jest.fn(),
    verifyPhoneNumber: jest.fn(),
    signOut: jest.fn(),
    deleteUser: jest.fn(),
    linkWithCredential: jest.fn(),
    revokeToken: jest.fn(),
  };
});

jest.mock('@react-native-firebase/analytics', () => {
  const analyticsInstance = {};

  return {
    __esModule: true,
    getAnalytics: jest.fn(() => analyticsInstance),
    logEvent: jest.fn(),
    setUserId: jest.fn(),
    setUserProperty: jest.fn(),
  };
});

jest.mock('@react-native-firebase/crashlytics', () => {
  const crashlyticsInstance = {};

  return {
    __esModule: true,
    getCrashlytics: jest.fn(() => crashlyticsInstance),
    log: jest.fn(),
    recordError: jest.fn(),
    crash: jest.fn(),
    setCrashlyticsCollectionEnabled: jest.fn(),
    setUserId: jest.fn(),
  };
});

jest.mock('@react-native-firebase/remote-config', () => {
  const remoteConfigInstance = {
    defaultConfig: {},
    settings: {
      minimumFetchIntervalMillis: 43200000,
      fetchTimeoutMillis: 60000,
    },
  };

  return {
    __esModule: true,
    getRemoteConfig: jest.fn(() => remoteConfigInstance),
    fetchAndActivate: jest.fn(async () => true),
    getValue: jest.fn(() => ({asString: () => '', asBoolean: () => false})),
  };
});

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
    requestPermission: jest.fn(async () => ({authorizationStatus: 1})),
    onForegroundEvent: jest.fn(() => jest.fn()),
    onBackgroundEvent: jest.fn(),
    cancelNotification: jest.fn(),
    getInitialNotification: jest.fn(async () => null),
  },
  AndroidImportance: {HIGH: 4},
  EventType: {PRESS: 1, DISMISSED: 2},
}));

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [{languageCode: 'en', countryCode: 'US'}]),
  getNumberFormatSettings: jest.fn(() => ({})),
  getCalendar: jest.fn(() => 'gregorian'),
  getCountry: jest.fn(() => 'US'),
  getCurrencies: jest.fn(() => ['USD']),
  getTemperatureUnit: jest.fn(() => 'celsius'),
  getTimeZone: jest.fn(() => 'America/New_York'),
  uses24HourClock: jest.fn(() => false),
  usesMetricSystem: jest.fn(() => false),
  findBestLanguageTag: jest.fn(() => ({languageTag: 'en'})),
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(async () => ({isConnected: true, isInternetReachable: true})),
    addEventListener: jest.fn(() => jest.fn()),
  },
  useNetInfo: jest.fn(() => ({isConnected: true})),
}));

jest.mock('react-native-maps', () => {
  const {View} = require('react-native');
  const MockMap = (props: object) => View(props);
  return {
    __esModule: true,
    default: MockMap,
    Marker: View,
    Polyline: View,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(() => ({
    execute: jest.fn(async () => ({rows: []})),
    close: jest.fn(),
  })),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => null),
  useCameraPermission: jest.fn(() => ({hasPermission: false, requestPermission: jest.fn()})),
  useCodeScanner: jest.fn(),
}));

jest.mock('stream-chat-react-native', () => ({
  Chat: ({children}: {children: unknown}) => children,
  Channel: ({children}: {children: unknown}) => children,
  MessageList: 'MessageList',
  MessageInput: 'MessageInput',
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(async () => true),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}));

jest.mock('react-native-fbsdk-next', () => ({
  LoginManager: {logInWithPermissions: jest.fn(), logOut: jest.fn()},
  AccessToken: {getCurrentAccessToken: jest.fn(async () => null)},
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: {
    performRequest: jest.fn(),
    Operation: {LOGIN: 1},
    Scope: {EMAIL: 0, FULL_NAME: 1},
  },
}));

jest.mock('@rneui/base', () => ({
  ScreenHeight: 800,
  ScreenWidth: 400,
}));

jest.mock('@rneui/themed', () => {
  const React = require('react');
  return {
    ThemeProvider: ({children}: {children: React.ReactNode}) => children,
    createTheme: jest.fn(() => ({})),
    withTheme: (c: unknown) => c,
  };
});

jest.mock('react-native-size-matters', () => ({
  scale: (n: number) => n,
  verticalScale: (n: number) => n,
  moderateScale: (n: number) => n,
  ScaledSheet: {create: (styles: object) => styles},
}));

jest.mock('react-native-share', () => ({
  __esModule: true,
  default: {open: jest.fn()},
}));

// Silence noisy warnings in test output
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  if (
    msg.includes('useNativeDriver') ||
    msg.includes('Animated:') ||
    msg.includes('ReactDOM.render')
  ) {
    return;
  }
  originalWarn(...args);
};
