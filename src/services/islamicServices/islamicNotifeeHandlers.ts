import notifee, {EventType, type Event} from '@notifee/react-native';

import {playAdhan} from '@services/islamicServices/adhanAudioService';
import {handleQuranMediaNotifeeEvent} from '@services/quranAudioService/quranMediaNotification';

declare global {
  // eslint-disable-next-line no-var
  var __RNTS_ISLAMIC_NOTIFEE_HANDLERS__: boolean | undefined;
}

const getNotificationKind = (event: Event): string | undefined => {
  const data = event.detail.notification?.data;
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  const kind = (data as {kind?: unknown}).kind;
  return typeof kind === 'string' ? kind : undefined;
};

/**
 * Routes Notifee events:
 * - prayer_adhan → play Adhan audio
 * - random_adhkar / islamic content → already has body; no duplicate display
 * - quran_playback → media controls (handled separately)
 */
export const handleIslamicNotifeeEvent = async (event: Event) => {
  const kind = getNotificationKind(event);
  const {type} = event;

  if (kind === 'prayer_adhan') {
    if (type === EventType.DELIVERED || type === EventType.PRESS) {
      playAdhan();
    }
    return;
  }

  // Random adhkar / other content notifications already include their text.
  // Do not spawn a second notification on DELIVERED (old bug).
};

export const registerIslamicNotifeeHandlers = () => {
  if (globalThis.__RNTS_ISLAMIC_NOTIFEE_HANDLERS__) {
    return;
  }

  globalThis.__RNTS_ISLAMIC_NOTIFEE_HANDLERS__ = true;

  // Keeps the Android FGS alive while Quran / Adhan audio plays from the shade.
  notifee.registerForegroundService(() => new Promise(() => undefined));

  notifee.onForegroundEvent(async event => {
    await handleQuranMediaNotifeeEvent(event);
    if (getNotificationKind(event) === 'quran_playback') {
      return;
    }
    await handleIslamicNotifeeEvent(event);
  });

  notifee.onBackgroundEvent(async event => {
    await handleQuranMediaNotifeeEvent(event);
    if (getNotificationKind(event) === 'quran_playback') {
      return;
    }
    await handleIslamicNotifeeEvent(event);
  });
};
