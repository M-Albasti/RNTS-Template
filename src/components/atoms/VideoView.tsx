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

interface VideoPlayerProps extends ReactVideoProps {
  onVideoReady: (ref: VideoRef) => void;
  uri: ReactVideoSource['uri'];
}

const VideoView = (props: VideoPlayerProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      videoBackground: {
        flex: 1,
        backgroundColor: tokens.colors.textPrimary,
        borderRadius: tokens.radius.lg,
      },
    }),
  );

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
