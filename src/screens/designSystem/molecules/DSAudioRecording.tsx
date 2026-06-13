import React from 'react';

import AudioRecording from '@molecules/audios/recordAudio/audioRecording';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Audio Recording',
  sections: [
    {
      title: 'Controls',
      content: (
        <AudioRecording
          startRecord={async () => {}}
          pauseRecord={async () => {}}
          resumeRecord={async () => {}}
          stopRecord={async () => {}}
          recordSecs={0}
          recordTime="00:00:00"
        />
      ),
    },
  ],
});
