import type {Middleware} from '@reduxjs/toolkit';
import {REHYDRATE} from 'redux-persist';

import {
  clearSentryUser,
  setSentryUser,
} from '@core/logging/sentryReporting';
import {addUser, logout} from '@redux/slices/authSlice';
import {hydratePreferences} from '@redux/slices/appSettingsSlice';
import {trackLogout} from '@services/firebaseServices/firebaseAuthAnalytics';
import {
  clearFirebaseUser,
  syncFirebaseUser,
} from '@services/firebaseServices/firebaseUserSync';

import type {User} from '@Types/userTypes';

/** Keeps Analytics/Crashlytics user identity in sync with Redux auth state. */
export const firebaseAuthMiddleware: Middleware = store => next => action => {
  const previousUser = store.getState().auth.user;
  const result = next(action);

  if (addUser.match(action)) {
    const user = action.payload as User | null;
    syncFirebaseUser(user);
    if (user?.uid) {
      setSentryUser(user.uid, user.loginType);
    } else {
      clearSentryUser();
    }
  }

  if (logout.match(action)) {
    if (previousUser?.loginType) {
      void trackLogout(previousUser.loginType);
    }
    clearFirebaseUser();
    clearSentryUser();
  }

  if ((action as {type?: string}).type === REHYDRATE) {
    const payload = (action as {payload?: {auth?: {user?: User | null}}}).payload;
    const user = payload?.auth?.user ?? null;
    syncFirebaseUser(user);
    if (user?.uid) {
      setSentryUser(user.uid, user.loginType);
    } else {
      clearSentryUser();
    }
    // Older persisted settings lack `preferences` — backfill before toggles run.
    store.dispatch(hydratePreferences());
  }

  return result;
};
