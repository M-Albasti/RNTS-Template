import React, {useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {appColors} from '@constants/colors';
import {VideoRef} from 'react-native-video';
import {VideoFile} from 'react-native-vision-camera';
import VideoView from '@atoms/VideoView';

interface VideoViewProps {
  videoFile: VideoFile;
}

const VideoContainer = (props: VideoViewProps): React.JSX.Element => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(true);
  const videoRef = useRef<VideoRef | null>();

  const onVideoReady = (ref: VideoRef) => {
    videoRef.current = ref;
  };

  const videoPause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const videoResume = () => {
    if (videoRef.current) {
      videoRef.current.resume();
    }
  };

  const videoDismissFullScreen = () => {
    if (videoRef.current) {
      setFullscreen(false);
      videoRef.current.dismissFullscreenPlayer();
    }
  };

  const videoPresentFullScreen = () => {
    if (videoRef.current) {
      setFullscreen(true);
      videoRef.current.presentFullscreenPlayer();
    }
  };

  return (
    <View style={styles.container}>
      <VideoView
        uri={props.videoFile.path}
        onVideoReady={onVideoReady}
        renderLoader={
          <ActivityIndicator
            color={appColors.green}
            size={'large'}
            style={StyleSheet.absoluteFill}
          />
        }
        fullscreen={fullscreen}
        repeat={repeat}
        controls={false}
      />
    </View>
  );
};

export default VideoContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
