import type {Middleware} from '@reduxjs/toolkit';
import {REHYDRATE} from 'redux-persist';

import {addUser, logout} from '@redux/slices/authSlice';
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
    syncFirebaseUser(action.payload as User | null);
  }

  if (logout.match(action)) {
    if (previousUser?.loginType) {
      void trackLogout(previousUser.loginType);
    }
    clearFirebaseUser();
  }

  if ((action as {type?: string}).type === REHYDRATE) {
    const payload = (action as {payload?: {auth?: {user?: User | null}}}).payload;
    syncFirebaseUser(payload?.auth?.user ?? null);
  }

  return result;
};
