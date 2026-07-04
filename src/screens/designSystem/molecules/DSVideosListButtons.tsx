import React from 'react';

import VideosListButtons from '@molecules/videos/videosList/buttons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Videos List Buttons',
  sections: [
    {
      title: 'Record action',
      content: <VideosListButtons navigateToRecordVideo={() => {}} />,
    },
  ],
});
