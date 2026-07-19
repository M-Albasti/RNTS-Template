import {
  AppState,
  DeviceEventEmitter,
  Linking,
  NativeModules,
  Platform,
} from 'react-native';

import {openQuranMushaf} from '@helpers/islamicDeepLinkNavigation';

export type QuranWidgetPlaybackAdapter = {
  resume: () => void;
  pause: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  stop: () => void;
  toggleRepeat: () => void;
  getSnapshot: () => {
    surahNumber: number;
    ayahNumber: number;
    isPlaying: boolean;
    isRepeatEnabled: boolean;
    title?: string;
  };
};

type QuranWidgetNativeModule = {
  updateWidget?: (payload: {
    surahNumber: number;
    ayahNumber: number;
    isPlaying: boolean;
    isRepeat: boolean;
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

const openCurrentMushaf = (): boolean => {
  const snap = playbackAdapter?.getSnapshot();
  openQuranMushaf(snap?.surahNumber ?? 1, snap?.ayahNumber ?? 1);
  return true;
};

/** Applies play/pause/next/prev/stop/repeat/open from a home-screen widget or deep link. */
export const handleQuranWidgetAction = (action: string): boolean => {
  const normalized = action.split('?')[0]?.replace(/\/$/, '') ?? '';

  if (normalized === 'open' || normalized.startsWith('open')) {
    const query = action.includes('?') ? action.slice(action.indexOf('?') + 1) : '';
    const params = new URLSearchParams(query);
    const surah = Number(params.get('surah'));
    const ayah = Number(params.get('ayah'));
    if (Number.isFinite(surah) && surah > 0) {
      openQuranMushaf(surah, Number.isFinite(ayah) && ayah > 0 ? ayah : 1);
      return true;
    }
    return openCurrentMushaf();
  }

  if (!playbackAdapter) {
    if (normalized === 'open') {
      return openCurrentMushaf();
    }
    return false;
  }

  switch (normalized) {
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
    case 'stop':
      playbackAdapter.stop();
      return true;
    case 'repeat':
      playbackAdapter.toggleRepeat();
      return true;
    default:
      return false;
  }
};

export const parseQuranWidgetUrl = (url: string | null | undefined): string | null => {
  if (!url || !url.startsWith(QURAN_WIDGET_URL_PREFIX)) {
    return null;
  }
  return url.slice(QURAN_WIDGET_URL_PREFIX.length) || null;
};

export const syncQuranHomeWidget = (payload: {
  surahNumber: number;
  ayahNumber: number;
  isPlaying: boolean;
  isRepeatEnabled?: boolean;
  title: string;
}): void => {
  try {
    NativeWidget?.updateWidget?.({
      surahNumber: payload.surahNumber,
      ayahNumber: payload.ayahNumber,
      isPlaying: payload.isPlaying,
      isRepeat: Boolean(payload.isRepeatEnabled),
      title: payload.title,
    });
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
        isRepeatEnabled: snap.isRepeatEnabled,
        title: snap.title ?? `Surah ${snap.surahNumber}`,
      });
    }
  });
  subscriptions.push(appStateSub);

  return () => {
    subscriptions.forEach(sub => sub.remove());
    globalThis.__RNTS_QURAN_WIDGET_BRIDGE__ = false;
  };
};
