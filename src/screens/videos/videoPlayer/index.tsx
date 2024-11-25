import {appColors} from '@constants/colors';
import React, {useRef, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {styles} from './styles';
import {VideoRef} from 'react-native-video';
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import VideoView from '@atoms/VideoView';

interface VideoPlayerProps {
  navigation: AppStackNavigationProp<'VideoPlayer'>;
  route: AppRouteProp<'VideoPlayer'>;
}

const VideoPlayer = (props: VideoPlayerProps): React.JSX.Element => {
  const {videoDetails} = props.route.params;
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const videoRef = useRef<VideoRef | null>();

  const onVideoReady = (ref: VideoRef) => {
    console.log('🚀 ~ onVideoReady ~ ref:', ref, videoDetails.sources[0]);
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
        uri={videoDetails.sources[0]}
        onVideoReady={onVideoReady}
        fullscreen={fullscreen}
        repeat={repeat}
        controls={true}
      />
    </View>
  );
};

export default VideoPlayer;
