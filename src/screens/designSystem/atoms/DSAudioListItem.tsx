import React from 'react';

import AudioListItem from '@atoms/AudioListItem';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Audio List Item',
  sections: [
    {
      title: 'Sample track',
      content: (
        <AudioListItem
          title="Keys of Moon"
          artist="The Epic Hero"
          artwork="https://picsum.photos/id/1003/200/300"
          onAudioItemPress={() => {}}
        />
      ),
    },
  ],
});
