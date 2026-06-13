//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {VideoFile} from 'react-native-vision-camera';
import {last} from 'lodash';

//* utils import
import {uniqueFileName} from '@utils/uniqueFileName';

//* components import
import Buttons from '@molecules/videos/videoPlayer/buttons';
import VideoContainer from '@molecules/videos/videoPlayer/videoContainer';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {useVideoContainer} from '@hooks/useVideoContainer';

//* redux import
import {uploadVideo} from '@redux/slices/videosSlice';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

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
  const uploadStatus = useAppSelector(state => state.video.status);

  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      container: {
        flex: tokens.layout.flex.fill,
        backgroundColor: tokens.colors.background,
      },
      player: {
        flex: tokens.layout.flex.fill,
      },
    }),
  );

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
    const extension = last(props.videoFile.path?.split('.')) || 'mp4';
    const type = `video/${extension}`;
    const videoFile = {
      uri: props.videoFile.path,
      type,
      name: uniqueFileName('video', extension),
    };
    const formData = new FormData();
    formData.append('file', videoFile as unknown as Blob);
    dispatch(uploadVideo(formData));
  };

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        <VideoContainer
          videoFileUri={props.videoFile.path}
          onVideoReady={onVideoReady}
          onError={onError}
          fullscreen={fullscreen}
          repeat={repeat}
          controls={false}
        />
      </View>
      <Buttons
        onDismiss={onDismiss}
        onRetakeVideo={onRetakeVideo}
        onUpload={onUpload}
        uploading={uploadStatus === 'loading'}
      />
    </View>
  );
};

export default VideoWithButtons;
