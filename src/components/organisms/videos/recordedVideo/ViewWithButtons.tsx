//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {VideoFile} from 'react-native-vision-camera';

//* components import
import Buttons from '@molecules/Videos/recordedVideo/Buttons';
import VideoView from '@molecules/Videos/recordedVideo/VideoContainer';

interface ViewWithButtonsProps {
  videoFile: VideoFile;
  onDismiss: () => void;
  onRetakeVideo: () => void;
  onUpload: () => void;
}

const ViewWithButtons = (props: ViewWithButtonsProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <VideoView videoFile={props.videoFile} />
      <Buttons
        onDismiss={props.onDismiss}
        onRetakeVideo={props.onRetakeVideo}
        onUpload={props.onUpload}
      />
    </View>
  );
};

export default ViewWithButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
