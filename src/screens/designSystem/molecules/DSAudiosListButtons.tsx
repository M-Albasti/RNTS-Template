import React from 'react';

import AudiosListButtons from '@molecules/audios/audiosList/buttons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Audios List Buttons',
  sections: [
    {
      title: 'Record action',
      content: <AudiosListButtons navigateToRecordAudio={() => {}} />,
    },
  ],
});
