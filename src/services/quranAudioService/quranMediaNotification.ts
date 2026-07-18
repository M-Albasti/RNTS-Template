import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  type Event,
} from '@notifee/react-native';
import {Platform} from 'react-native';

import {quranAudioController} from '@services/quranAudioService/quranAudioController';

const CHANNEL_ID = 'quran-playback';
const NOTIFICATION_ID = 'quran-playback-controls';

const ensureChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Quran playback',
    importance: AndroidImportance.LOW,
    visibility: AndroidVisibility.PUBLIC,
    vibration: false,
  });
};

/**
 * Ongoing media-style notification so the user can control Quran audio
 * from the shade / lock screen while the app is backgrounded.
 */
export const syncQuranMediaNotification = async (args: {
  surahNumber: number;
  ayahNumber: number;
  isPlaying: boolean;
  surahTitle: string;
}): Promise<void> => {
  const {surahNumber, ayahNumber, isPlaying, surahTitle} = args;

  if (!isPlaying && !quranAudioController.getSnapshot().hasLoadedTrack) {
    await notifee.cancelNotification(NOTIFICATION_ID);
    return;
  }

  await ensureChannel();

  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title: surahTitle,
    body: `Ayah ${ayahNumber} · Surah ${surahNumber}`,
    data: {
      kind: 'quran_playback',
      surahNumber: String(surahNumber),
      ayahNumber: String(ayahNumber),
    },
    android: {
      channelId: CHANNEL_ID,
      asForegroundService: true,
      ongoing: true,
      onlyAlertOnce: true,
      pressAction: {id: 'default', launchActivity: 'default'},
      actions: [
        {title: 'Previous', pressAction: {id: 'quran_prev'}},
        {
          title: isPlaying ? 'Pause' : 'Play',
          pressAction: {id: isPlaying ? 'quran_pause' : 'quran_play'},
        },
        {title: 'Next', pressAction: {id: 'quran_next'}},
      ],
    },
    ios: {
      categoryId: 'quran_playback',
      interruptionLevel: 'active',
    },
  });
};

export const clearQuranMediaNotification = async (): Promise<void> => {
  try {
    await notifee.stopForegroundService();
  } catch {
    // ignore when no FGS is running
  }
  await notifee.cancelNotification(NOTIFICATION_ID);
};

const handleAction = (actionId?: string) => {
  switch (actionId) {
    case 'quran_play':
      quranAudioController.resume();
      break;
    case 'quran_pause':
      quranAudioController.pause();
      break;
    case 'quran_next':
      quranAudioController.playNext();
      break;
    case 'quran_prev':
      quranAudioController.playPrevious();
      break;
    default:
      break;
  }
};

export const handleQuranMediaNotifeeEvent = async ({
  type,
  detail,
}: Event): Promise<void> => {
  if (type !== EventType.ACTION_PRESS && type !== EventType.PRESS) {
    return;
  }
  const kind = detail.notification?.data?.kind;
  if (kind !== 'quran_playback') {
    return;
  }
  handleAction(detail.pressAction?.id);
};

/** @deprecated Handlers are registered via registerIslamicNotifeeHandlers. */
export const registerQuranMediaNotifeeHandlers = () => {
  // no-op — kept for import compatibility
};