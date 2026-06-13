import React from 'react';
import {View} from 'react-native';

import VideoContainer from '@molecules/videos/videoPlayer/videoContainer';

import {videos} from '@constants/videos';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Video Container',
  sections: [
    {
      title: 'Sample video',
      content: (
        <View style={{height: 200}}>
          <VideoContainer
            videoFileUri={videos[0].sources[0]}
            onVideoReady={() => {}}
            controls
          />
        </View>
      ),
    },
  ],
});
