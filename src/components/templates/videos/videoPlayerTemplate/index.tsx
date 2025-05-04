//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import VideoPlayerView from '@organisms/videos/videoPlayer/VideoPlayerView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {VideoProps} from '@Types/videoProps';

interface VideoPlayerProps {
  navigation: AppStackNavigationProp<'VideoPlayer'>;
  videoDetails: VideoProps;
}

const VideoPlayerTemplate = (props: VideoPlayerProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <VideoPlayerView
        navigation={props.navigation}
        videoDetails={props.videoDetails}
      />
    </View>
  );
};

export default VideoPlayerTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
