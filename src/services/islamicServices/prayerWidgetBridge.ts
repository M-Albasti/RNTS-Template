import {
  AppState,
  DeviceEventEmitter,
  Linking,
  NativeModules,
  Platform,
} from 'react-native';

import {openPrayerTimes} from '@helpers/islamicDeepLinkNavigation';
import type {PrayerReminderKey} from '@Types/islamicTypes';

export type PrayerWidgetSyncPayload = {
  locationLabel: string;
  timezone: string;
  nextPrayerKey: string;
  nextPrayerName: string;
  nextPrayerTime: string;
  countdown: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  reminderEnabled: boolean;
};

type PrayerWidgetNativeModule = {
  updateWidget?: (payload: PrayerWidgetSyncPayload) => void;
};

export type PrayerWidgetActionHandlers = {
  onToggleReminder?: (key?: PrayerReminderKey) => void;
  onOpenPrayers?: () => void;
};

const NativeWidget = NativeModules.PrayerWidgetModule as
  | PrayerWidgetNativeModule
  | undefined;

export const PRAYER_WIDGET_URL_PREFIX = 'projectdeeplink://prayer/';

let actionHandlers: PrayerWidgetActionHandlers = {};

export const bindPrayerWidgetActions = (handlers: PrayerWidgetActionHandlers): void => {
  actionHandlers = handlers;
};

export const syncPrayerHomeWidget = (payload: PrayerWidgetSyncPayload): void => {
  try {
    NativeWidget?.updateWidget?.(payload);
  } catch (error) {
    console.log('syncPrayerHomeWidget Error =>', error);
  }
};

export const handlePrayerWidgetAction = (action: string): boolean => {
  const normalized = action.split('?')[0]?.replace(/\/$/, '') ?? '';

  if (normalized === 'open' || normalized === '') {
    if (actionHandlers.onOpenPrayers) {
      actionHandlers.onOpenPrayers();
    } else {
      openPrayerTimes();
    }
    return true;
  }

  if (normalized === 'remind' || normalized.startsWith('remind')) {
    const key = normalized.includes('/')
      ? (normalized.split('/')[1] as PrayerReminderKey | undefined)
      : undefined;
    actionHandlers.onToggleReminder?.(key);
    return true;
  }

  return false;
};

export const parsePrayerWidgetUrl = (url: string | null | undefined): string | null => {
  if (!url || !url.startsWith(PRAYER_WIDGET_URL_PREFIX)) {
    return null;
  }
  return url.slice(PRAYER_WIDGET_URL_PREFIX.length) || 'open';
};

declare global {
  // eslint-disable-next-line no-var
  var __RNTS_PRAYER_WIDGET_BRIDGE__: boolean | undefined;
}

export const registerPrayerWidgetBridge = (): (() => void) => {
  if (globalThis.__RNTS_PRAYER_WIDGET_BRIDGE__) {
    return () => undefined;
  }
  globalThis.__RNTS_PRAYER_WIDGET_BRIDGE__ = true;

  const subscriptions: Array<{remove: () => void}> = [];

  if (Platform.OS === 'android') {
    subscriptions.push(
      DeviceEventEmitter.addListener(
        'PrayerWidgetAction',
        (event: {action?: string}) => {
          if (event?.action) {
            handlePrayerWidgetAction(event.action);
          }
        },
      ),
    );
  }

  const onUrl = ({url}: {url: string}) => {
    const action = parsePrayerWidgetUrl(url);
    if (action) {
      handlePrayerWidgetAction(action);
    }
  };
  subscriptions.push(Linking.addEventListener('url', onUrl));

  void Linking.getInitialURL().then(url => {
    const action = parsePrayerWidgetUrl(url);
    if (action) {
      setTimeout(() => handlePrayerWidgetAction(action), 400);
    }
  });

  const appStateSub = AppState.addEventListener('change', () => {
    // Host refreshes payload on active; bridge only needs to stay registered.
  });
  subscriptions.push(appStateSub);

  return () => {
    subscriptions.forEach(sub => sub.remove());
    globalThis.__RNTS_PRAYER_WIDGET_BRIDGE__ = false;
  };
};
