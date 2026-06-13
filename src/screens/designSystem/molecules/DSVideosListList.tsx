import React from 'react';
import {View} from 'react-native';

import VideosListList from '@molecules/videos/videosList/list';

import {videos} from '@constants/videos';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Videos List',
  sections: [
    {
      title: 'FlashList sample',
      content: (
        <View style={{height: 280}}>
          <VideosListList
            videosData={videos.slice(0, 4)}
            onVideoItemPress={() => {}}
          />
        </View>
      ),
    },
  ],
});
