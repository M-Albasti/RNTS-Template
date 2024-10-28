import React from 'react';
import {StyleSheet, View} from 'react-native';
import ViewWithButtons from '@organisms/videos/recordedVideo/ViewWithButtons';
import {VideoFile} from 'react-native-vision-camera';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface PreviewProps {
  navigation: AppStackNavigationProp<'RecordVideo'>;
  videoFile: VideoFile;
  setVideoFile: (video?: VideoFile) => void;
}

const Preview = (props: PreviewProps): React.JSX.Element => {
  const onDismiss = () => {
    props.setVideoFile();
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    }
  };

  const onRetakeVideo = () => {
    props.setVideoFile();
  };

  const onUpload = () => {
    console.log('Upload Functionality !!');
  };

  return (
    <View style={styles.container}>
      <ViewWithButtons
        videoFile={props.videoFile}
        onDismiss={onDismiss}
        onRetakeVideo={onRetakeVideo}
        onUpload={onUpload}
      />
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
