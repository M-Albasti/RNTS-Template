import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import Video, {
  OnProgressData,
  OnVideoErrorData,
  ReactVideoProps,
  ReactVideoSource,
  VideoRef,
} from 'react-native-video';

interface VideoPlayerProps extends ReactVideoProps {
  onVideoReady: (ref: VideoRef) => void;
  uri: ReactVideoSource['uri'];
}

const VideoPlayer = ({
  uri,
  onVideoReady,
  fullscreen,
  repeat,
  controls,
  onReadyForDisplay,
}: VideoPlayerProps) => {
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
      repeat={repeat}
      fullscreen={fullscreen}
      style={styles.backgroundVideo}
      onReadyForDisplay={onReadyForDisplay}
      controls={controls}
      onProgress={(progress: OnProgressData) => {
        console.log('progress =>', progress);
      }}
    />
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1,
  },
});
