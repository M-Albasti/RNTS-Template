import React from 'react';
import {View} from 'react-native';

import VideoPlayerView from '@organisms/videos/videoPlayer/VideoPlayerView';

import {videos} from '@constants/videos';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {videoPlayerShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Video Player View',
  sections: [
    {
      title: 'Sample video',
      content: (
        <View style={{height: 220}}>
          <VideoPlayerView
            navigation={videoPlayerShowcaseNavigation}
            videoDetails={videos[0]}
          />
        </View>
      ),
    },
  ],
});
