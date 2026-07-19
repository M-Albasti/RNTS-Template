import SoundPlayer from 'react-native-sound-player';

import {DEFAULT_ADHAN_SOUND_ID, resolveAdhanAudioUrl} from '@constants/adhanAudio';
import {configureBackgroundAudioPlayback} from '@helpers/backgroundAudio';
import {store} from '@redux/store';
import {quranAudioController} from '@services/quranAudioService/quranAudioController';

const resolveUrl = (urlOrId?: string): string => {
  if (urlOrId?.startsWith('http')) {
    return urlOrId;
  }
  if (urlOrId) {
    return resolveAdhanAudioUrl(urlOrId);
  }
  try {
    const soundId =
      store.getState().islamic.prayerReminders?.adhanSoundId ?? DEFAULT_ADHAN_SOUND_ID;
    return resolveAdhanAudioUrl(soundId);
  } catch {
    return resolveAdhanAudioUrl(DEFAULT_ADHAN_SOUND_ID);
  }
};

/**
 * Plays the Adhan when a prayer reminder fires (or when previewing in the picker).
 * Pauses Quran playback first so streams do not overlap.
 */
export const playAdhan = (urlOrId?: string): void => {
  try {
    const quran = quranAudioController.getSnapshot();
    if (quran.isPlaying) {
      quranAudioController.pause();
    }
  } catch {
    // ignore
  }

  try {
    configureBackgroundAudioPlayback();
    SoundPlayer.stop();
  } catch {
    // ignore
  }

  try {
    SoundPlayer.playUrl(resolveUrl(urlOrId));
  } catch (error) {
    console.log('adhanAudioService.playAdhan Error =>', error);
  }
};

export const stopAdhan = (): void => {
  try {
    SoundPlayer.stop();
  } catch (error) {
    console.log('adhanAudioService.stopAdhan Error =>', error);
  }
};
