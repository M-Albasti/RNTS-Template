//* packages import
import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import Video, {
  OnProgressData,
  OnVideoErrorData,
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

const VideoView = ({
  uri,
  onVideoReady,
  fullscreen,
  repeat,
  controls,
  onReadyForDisplay,
  renderLoader,
}: VideoPlayerProps): React.JSX.Element => {
  const onError = useCallback((error: OnVideoErrorData) => {
    console.log('Video Error =>', error);
  }, []);

  return (
    <Video
      // Can be a URL or a local file.
      source={{uri: uri}}
      // Store reference
      ref={(ref: VideoRef) => onVideoReady(ref)}
      // Callback when video cannot be loaded
      onError={onError}
      disableFocus
      repeat={repeat}
      fullscreen={fullscreen}
      style={styles.backgroundVideo}
      playWhenInactive={false}
      playInBackground={false}
      renderLoader={renderLoader}
      volume={1.0}
      resizeMode={'contain'}
      ignoreSilentSwitch={'obey'}
      onReadyForDisplay={onReadyForDisplay}
      controls={controls}
      onProgress={(progress: OnProgressData) => {
        console.log('progress =>', progress);
      }}
    />
  );
};

export default VideoView;

const styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1,
    backgroundColor: appColors.black,
  },
});
