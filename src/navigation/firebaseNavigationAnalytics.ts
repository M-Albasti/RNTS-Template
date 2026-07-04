import type {NavigationState, PartialState} from '@react-navigation/native';

import {logScreenView} from '@services/firebaseServices/firebaseAnalyticsService';
import {logCrashlytics} from '@services/firebaseServices/firebaseCrashlyticsService';

type NavState = NavigationState | PartialState<NavigationState>;

const getActiveRouteName = (state: NavState | undefined): string | undefined => {
  if (!state?.routes?.length) {
    return undefined;
  }

  const route = state.routes[state.index ?? 0];
  if (!route) {
    return undefined;
  }

  if (route.state) {
    return getActiveRouteName(route.state as NavState);
  }

  return route.name;
};

export const trackNavigationScreenChange = (
  getRootState: () => NavState | undefined,
): void => {
  const currentRouteName = getActiveRouteName(getRootState());
  if (!currentRouteName) {
    return;
  }

  logCrashlytics(`screen:${currentRouteName}`);
  void logScreenView(currentRouteName);
};
