import React from 'react';
import {View} from 'react-native';

import VideoPlayerView from '@organisms/videos/videoPlayer/VideoPlayerView';

import {videos} from '@constants/videos';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDSVideoPlayerViewStyles} from './styles/resolveDSVideoPlayerViewStyles';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {videoPlayerShowcaseNavigation} from '../shared/showcaseHelpers';

const VideoPlayerPreview = (): React.JSX.Element => {
  const styles = useThemedStyles(resolveDSVideoPlayerViewStyles);

  return (
    <View style={styles.container}>
      <VideoPlayerView
        navigation={videoPlayerShowcaseNavigation}
        videoDetails={videos[0]}
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Video Player View',
  sections: [
    {
      title: 'Sample video',
      content: <VideoPlayerPreview />,
    },
  ],
});
