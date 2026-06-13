import React from 'react';
import {View} from 'react-native';

import VideoContainer from '@molecules/videos/videoPlayer/videoContainer';

import {videos} from '@constants/videos';
import {useThemedStyles} from '@theme/createThemedStyles';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const VideoContainerPreview = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    container: {height: tokens.sizes.videoPreview},
  }));

  return (
    <View style={styles.container}>
      <VideoContainer
        videoFileUri={videos[0].sources[0]}
        onVideoReady={() => {}}
        controls
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Video Container',
  sections: [
    {
      title: 'Sample video',
      content: <VideoContainerPreview />,
    },
  ],
});
