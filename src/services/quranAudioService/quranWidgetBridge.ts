import {
  AppState,
  DeviceEventEmitter,
  Linking,
  NativeModules,
  Platform,
} from 'react-native';

export type QuranWidgetPlaybackAdapter = {
  resume: () => void;
  pause: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  getSnapshot: () => {
    surahNumber: number;
    ayahNumber: number;
    isPlaying: boolean;
  };
};

type QuranWidgetNativeModule = {
  updateWidget?: (payload: {
    surahNumber: number;
    ayahNumber: number;
    isPlaying: boolean;
    title: string;
  }) => void;
};

const NativeWidget = NativeModules.QuranWidgetModule as QuranWidgetNativeModule | undefined;

export const QURAN_WIDGET_URL_PREFIX = 'projectdeeplink://quran/';

let playbackAdapter: QuranWidgetPlaybackAdapter | null = null;

/** Bind the live Quran player so home-screen widgets can control it. */
export const bindQuranWidgetPlayback = (
  adapter: QuranWidgetPlaybackAdapter | null,
): void => {
  playbackAdapter = adapter;
};

/** Applies play/pause/next/prev from a home-screen widget or deep link. */
export const handleQuranWidgetAction = (action: string): boolean => {
  if (!playbackAdapter) {
    return false;
  }
  switch (action) {
    case 'play':
      playbackAdapter.resume();
      return true;
    case 'pause':
      playbackAdapter.pause();
      return true;
    case 'toggle':
      playbackAdapter.togglePlay();
      return true;
    case 'next':
      playbackAdapter.playNext();
      return true;
    case 'prev':
    case 'previous':
      playbackAdapter.playPrevious();
      return true;
    default:
      return false;
  }
};

export const parseQuranWidgetUrl = (url: string | null | undefined): string | null => {
  if (!url || !url.startsWith(QURAN_WIDGET_URL_PREFIX)) {
    return null;
  }
  const action = url
    .slice(QURAN_WIDGET_URL_PREFIX.length)
    .split('?')[0]
    ?.replace(/\/$/, '');
  return action || null;
};

export const syncQuranHomeWidget = (payload: {
  surahNumber: number;
  ayahNumber: number;
  isPlaying: boolean;
  title: string;
}): void => {
  try {
    NativeWidget?.updateWidget?.(payload);
  } catch (error) {
    console.log('syncQuranHomeWidget Error =>', error);
  }
};

declare global {
  // eslint-disable-next-line no-var
  var __RNTS_QURAN_WIDGET_BRIDGE__: boolean | undefined;
}

/**
 * Listens for widget taps (native events + deep links) and keeps the
 * home-screen widget UI in sync with the bound playback adapter.
 */
export const registerQuranWidgetBridge = (): (() => void) => {
  if (globalThis.__RNTS_QURAN_WIDGET_BRIDGE__) {
    return () => undefined;
  }
  globalThis.__RNTS_QURAN_WIDGET_BRIDGE__ = true;

  const subscriptions: Array<{remove: () => void}> = [];

  if (Platform.OS === 'android') {
    subscriptions.push(
      DeviceEventEmitter.addListener(
        'QuranWidgetAction',
        (event: {action?: string}) => {
          if (event?.action) {
            handleQuranWidgetAction(event.action);
          }
        },
      ),
    );
  }

  const onUrl = ({url}: {url: string}) => {
    const action = parseQuranWidgetUrl(url);
    if (action) {
      handleQuranWidgetAction(action);
    }
  };
  subscriptions.push(Linking.addEventListener('url', onUrl));

  void Linking.getInitialURL().then(url => {
    const action = parseQuranWidgetUrl(url);
    if (action) {
      setTimeout(() => handleQuranWidgetAction(action), 400);
    }
  });

  const appStateSub = AppState.addEventListener('change', state => {
    if (state === 'active' && playbackAdapter) {
      const snap = playbackAdapter.getSnapshot();
      syncQuranHomeWidget({
        surahNumber: snap.surahNumber,
        ayahNumber: snap.ayahNumber,
        isPlaying: snap.isPlaying,
        title: `Surah ${snap.surahNumber}`,
      });
    }
  });
  subscriptions.push(appStateSub);

  return () => {
    subscriptions.forEach(sub => sub.remove());
    globalThis.__RNTS_QURAN_WIDGET_BRIDGE__ = false;
  };
};
