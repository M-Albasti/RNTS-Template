//* packages import
import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

//* components import
import VideoView from '@atoms/VideoView';

//* theme import
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveVideoContainerStyles} from './styles/resolveVideoContainerStyles';

//* types import
import {VideoRef, ReactVideoSource, OnVideoErrorData} from 'react-native-video';

interface VideoViewProps {
  videoFileUri: ReactVideoSource['uri'];
  onVideoReady: (ref: VideoRef) => void;
  onError?: (error: OnVideoErrorData) => void;
  fullscreen?: boolean;
  repeat?: boolean;
  controls?: boolean;
}

const VideoContainer = (props: VideoViewProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveVideoContainerStyles);
  const {colors} = useThemeTokens();

  return (
    <VideoView
      uri={props.videoFileUri}
      onVideoReady={props.onVideoReady}
      onError={props.onError}
      renderLoader={
        <ActivityIndicator
          color={colors.primary}
          size="large"
          style={styles.loader}
        />
      }
      fullscreen={props.fullscreen}
      repeat={props.repeat}
      controls={props.controls}
    />
  );
};

export default VideoContainer;
