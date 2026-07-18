import {Platform} from 'react-native';
import SoundPlayer from 'react-native-sound-player';

/**
 * Prepares the native audio session so Quran / adhkar playback can continue
 * while the app is backgrounded (not force-quit).
 *
 * iOS: sets AVAudioSession category to Playback (via setMixAudio).
 * Android: MediaPlayer already uses STREAM_MUSIC; keep a no-op warm call.
 */
export const configureBackgroundAudioPlayback = (): void => {
  try {
    // iOS: setMixAudio(false) → AVAudioSessionCategoryPlayback + setActive.
    // Required for playUrl() streams (file mounts set this automatically).
    if (Platform.OS === 'ios') {
      SoundPlayer.setMixAudio(false);
    }
  } catch (error) {
    console.log('configureBackgroundAudioPlayback Error =>', error);
  }
};

/** Hisn Muslim often returns http:// — upgrade so Android cleartext is not required. */
export const toSecureMediaUrl = (url?: string | null): string | undefined => {
  if (!url) {
    return undefined;
  }
  return url.replace(/^http:\/\//i, 'https://');
};
