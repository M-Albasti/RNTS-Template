import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import VideosList from '@molecules/videos/VideosList';
import {VideoProps} from '@constants/videos';
import VideosListButtons from '@molecules/videos/VideosListButtons';

interface VideosListWithButtonsProps {
  videosData: VideoProps[];
  onVideoItemPress: (value: VideoProps) => void;
  navigateToRecordVideo: () => void;
}

const VideosListWithButtons = (props: VideosListWithButtonsProps) => {
  return (
    <View style={styles.container}>
      <VideosList
        videosData={props.videosData}
        onVideoItemPress={props.onVideoItemPress}
      />
      <VideosListButtons navigateToRecordVideo={props.navigateToRecordVideo} />
    </View>
  );
};

export default VideosListWithButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
