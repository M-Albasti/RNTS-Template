import React from 'react';
import {View} from 'react-native';

import ScreenHeader from '@atoms/ScreenHeader';
import VideoPlayerView from '@organisms/videos/videoPlayer/VideoPlayerView';

import {videos} from '@constants/videos';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {videoPlayerShowcaseNavigation} from '../shared/showcaseHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';

const VideoPlayerContent = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    player: {
      flex: tokens.layout.flex.fill,
      borderRadius: tokens.radius.lg,
      overflow: tokens.layout.overflow.hidden,
      height: tokens.sizes.videoPlayer,
    },
  }));

  return (
    <>
      <ScreenHeader title={videos[0].title} onBack={() => {}} />
      <View style={styles.player}>
        <VideoPlayerView
          navigation={videoPlayerShowcaseNavigation}
          videoDetails={videos[0]}
        />
      </View>
    </>
  );
};

export default createShowcaseScreen({
  title: 'Video Player Template',
  sections: [{title: 'Player screen content', content: <VideoPlayerContent />}],
});
