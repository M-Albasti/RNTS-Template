import React from 'react';

import AudioContent from '@molecules/audios/audioPlayer/audioContent';

import {sounds} from '@constants/sounds';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Audio Player Content',
  sections: [
    {title: 'Sample track', content: <AudioContent audioDetails={sounds[0]} />},
  ],
});
