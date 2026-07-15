import {getMessaging, setBackgroundMessageHandler} from '@react-native-firebase/messaging';

import {setupApiMocks} from '@config/network/setupMocks';
import {handleFirebaseBackgroundMessage} from '@services/firebaseServices/firebaseMessagingService';
import {registerIslamicNotifeeHandlers} from '@services/islamicServices/islamicNotifeeHandlers';

declare global {
  // eslint-disable-next-line no-var
  var __RNTS_APP_ENTRY_SETUP__: boolean | undefined;
}

/**
 * Runs index.js side effects once per native app process.
 * Metro reload re-evaluates index.js; duplicate native handler registration crashes the app.
 */
export const runAppEntrySetup = (): void => {
  if (globalThis.__RNTS_APP_ENTRY_SETUP__) {
    return;
  }

  globalThis.__RNTS_APP_ENTRY_SETUP__ = true;

  setupApiMocks();
  registerIslamicNotifeeHandlers();

  try {
    setBackgroundMessageHandler(getMessaging(), handleFirebaseBackgroundMessage);
  } catch (error) {
    console.log('Firebase background handler registration skipped =>', error);
  }
};
