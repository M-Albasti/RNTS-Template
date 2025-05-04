//* packages import
import React from 'react';
import {StyleSheet} from 'react-native';
import Video, {
  ReactVideoProps,
  ReactVideoSource,
  VideoRef,
} from 'react-native-video';

//* constants import
import {appColors} from '@constants/colors';

interface VideoPlayerProps extends ReactVideoProps {
  onVideoReady: (ref: VideoRef) => void;
  uri: ReactVideoSource['uri'];
}

const VideoView = (props: VideoPlayerProps): React.JSX.Element => {
  return (
    <Video
      // Can be a URL or a local file.
      source={{uri: props.uri}}
      // Store reference
      ref={(ref: VideoRef) => props.onVideoReady(ref)}
      style={styles.videoBackground}
      playWhenInactive={false}
      playInBackground={false}
      volume={1.0}
      resizeMode={'contain'}
      ignoreSilentSwitch={'obey'}
      {...props}
    />
  );
};

export default VideoView;

const styles = StyleSheet.create({
  videoBackground: {
    flex: 1,
    backgroundColor: appColors.black,
  },
});
