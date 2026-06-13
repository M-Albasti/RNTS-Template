import React from 'react';

import AudioPlayback from '@molecules/audios/recordAudio/audioPlayback';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Audio Playback',
  sections: [
    {
      title: 'Preview controls',
      content: (
        <AudioPlayback
          startPlay={async () => {}}
          pausePlay={async () => {}}
          resumePlay={async () => {}}
          stopPlay={async () => {}}
          currentPositionSec={15}
          currentDurationSec={60}
          duration="01:00"
          playTime="00:15"
          status="idle"
        />
      ),
    },
  ],
});
