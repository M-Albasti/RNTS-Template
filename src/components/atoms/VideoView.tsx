//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';
import Video, {
  ReactVideoProps,
  ReactVideoSource,
  VideoRef,
} from 'react-native-video';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveVideoViewStyles} from './styles/resolveVideoViewStyles';

interface VideoPlayerProps extends ReactVideoProps {
  onVideoReady: (ref: VideoRef) => void;
  uri: ReactVideoSource['uri'];
}

const VideoView = (props: VideoPlayerProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveVideoViewStyles);

  return (
    <Video
      source={{uri: props.uri}}
      ref={(ref: VideoRef) => props.onVideoReady(ref)}
      style={styles.videoBackground}
      playWhenInactive={false}
      playInBackground={false}
      volume={1.0}
      resizeMode="contain"
      ignoreSilentSwitch="obey"
      {...props}
    />
  );
};

export default VideoView;
