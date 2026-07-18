import React, {useEffect} from 'react';

import {registerQuranWidgetBridge} from '@services/quranAudioService/quranWidgetBridge';

/**
 * Registers home-screen Quran widget deep links / native events.
 *
 * Playback control is inactive until the Quran audio feature calls
 * `bindQuranWidgetPlayback(...)` (see ios/QuranWidget/README.md).
 */
const QuranWidgetHost = (): null => {
  useEffect(() => {
    return registerQuranWidgetBridge();
  }, []);

  return null;
};

export default QuranWidgetHost;
