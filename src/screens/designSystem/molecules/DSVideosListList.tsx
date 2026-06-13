import React from 'react';
import {View} from 'react-native';

import VideosListList from '@molecules/videos/videosList/list';

import {videos} from '@constants/videos';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {sizes} from '@theme/tokens/sizes';

export default createShowcaseScreen({
  title: 'Videos List',
  sections: [
    {
      title: 'FlashList sample',
      content: (
        <View style={{height: sizes.mapPreview}}>
          <VideosListList
            videosData={videos.slice(0, 4)}
            onVideoItemPress={() => {}}
          />
        </View>
      ),
    },
  ],
});
