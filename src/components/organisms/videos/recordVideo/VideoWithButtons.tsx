//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {VideoFile} from 'react-native-vision-camera';
import moment from 'moment';
import {last} from 'lodash';

//* components import
import Buttons from '@molecules/Videos/recordedVideo/Buttons';
import VideoContainer from '@molecules/Videos/recordedVideo/VideoContainer';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useVideoContainer} from '@hooks/useVideoContainer';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface ViewWithButtonsProps {
  videoFile: VideoFile;
  emptyVideoFile: () => void;
  retakeVideo: () => void;
  navigation: AppStackNavigationProp<'RecordVideo'>;
}

const VideoWithButtons = (props: ViewWithButtonsProps): React.JSX.Element => {
  const {fullscreen, repeat, onVideoReady, onError} = useVideoContainer();
  const dispatch = useAppDispatch();

  const onDismiss = () => {
    props.emptyVideoFile();
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    }
  };

  const onRetakeVideo = () => {
    props.retakeVideo();
  };

  const onUpload = () => {
    const extension = last(props.videoFile.path?.split('.')) || '';
    const type = `video/${extension}`;
    const videoFile = {
      uri: props.videoFile.path,
      type: type,
      name: `video-${moment().unix()}.${extension}`,
    };
    const formData = new FormData();
    formData.append('file', videoFile);
    // dispatch(uploadVideo(formData)).then(() => {
    //   dispatch(addVideo(videoFile));
    // });
    // console.log('Upload Functionality !!');
  };

  return (
    <View style={styles.container}>
      <VideoContainer
        videoFileUri={props.videoFile.path}
        onVideoReady={onVideoReady}
        onError={onError}
        fullscreen={fullscreen}
        repeat={repeat}
        controls={false}
      />
      <Buttons
        onDismiss={onDismiss}
        onRetakeVideo={onRetakeVideo}
        onUpload={onUpload}
      />
    </View>
  );
};

export default VideoWithButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
