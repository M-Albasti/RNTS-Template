import React from 'react';

import VideoListItem from '@atoms/VideoListItem';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Video List Item',
  sections: [
    {
      title: 'Sample video',
      content: (
        <VideoListItem
          title="Big Buck Bunny"
          subtitle="By Blender Foundation"
          thumb="https://picsum.photos/150/150?image=0"
          onVideoItemPress={() => {}}
        />
      ),
    },
  ],
});
