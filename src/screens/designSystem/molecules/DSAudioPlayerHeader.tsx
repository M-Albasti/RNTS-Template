import React from 'react';

import AudioHeader from '@molecules/audios/audioPlayer/audioHeader';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {audioPlayerShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Audio Player Header',
  sections: [
    {
      title: 'Default',
      content: <AudioHeader navigation={audioPlayerShowcaseNavigation} />,
    },
  ],
});
