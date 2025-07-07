//* packages import
import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

//* components import
import VideoView from '@atoms/VideoView';

//* constants import
import {appColors} from '@constants/colors';

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
  return (
    <VideoView
      uri={props.videoFileUri}
      onVideoReady={props.onVideoReady}
      onError={props.onError}
      renderLoader={
        <ActivityIndicator
          color={appColors.green}
          size={'large'}
          style={StyleSheet.absoluteFill}
        />
      }
      fullscreen={props.fullscreen}
      repeat={props.repeat}
      controls={props.controls}
    />
  );
};

export default VideoContainer;
