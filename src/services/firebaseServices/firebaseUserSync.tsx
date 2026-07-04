import {
  logAnalyticsEvent,
  setAnalyticsUserId,
  setAnalyticsUserProperty,
} from '@services/firebaseServices/firebaseAnalyticsService';
import {
  logCrashlytics,
  setCrashlyticsUserId,
} from '@services/firebaseServices/firebaseCrashlyticsService';

import type {User} from '@Types/userTypes';

/** Links Analytics + Crashlytics to the signed-in user (or clears on logout). */
export const syncFirebaseUser = (user: User | null): void => {
  if (!user?.uid) {
    void setAnalyticsUserId(null);
    setCrashlyticsUserId('');
    return;
  }

  void setAnalyticsUserId(String(user.uid));
  setCrashlyticsUserId(String(user.uid));
  void setAnalyticsUserProperty('login_type', user.loginType ?? null);
  logCrashlytics(`auth:user_sync uid=${user.uid}`);
};

export const clearFirebaseUser = (): void => {
  syncFirebaseUser(null);
};

export const trackAppOpen = async (): Promise<void> => {
  await logAnalyticsEvent('app_open');
};
