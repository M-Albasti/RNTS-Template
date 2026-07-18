import SoundPlayer from 'react-native-sound-player';

import {ADHAN_AUDIO_URL} from '@constants/adhanAudio';
import {configureBackgroundAudioPlayback} from '@helpers/backgroundAudio';
import {quranAudioController} from '@services/quranAudioService/quranAudioController';

/**
 * Plays the Adhan when a prayer reminder fires.
 * Pauses Quran playback first so streams do not overlap.
 */
export const playAdhan = (): void => {
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
    SoundPlayer.playUrl(ADHAN_AUDIO_URL);
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
