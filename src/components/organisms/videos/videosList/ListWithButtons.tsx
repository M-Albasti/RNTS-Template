import {StyleSheet, View} from 'react-native';
import React from 'react';
import List from '@molecules/videos/videosList/List';
import {VideoProps} from '@constants/videos';
import Buttons from '@molecules/videos/videosList/Buttons';

interface VideosListWithButtonsProps {
  videosData: VideoProps[];
  onVideoItemPress: (value: VideoProps) => void;
  navigateToRecordVideo: () => void;
}

const ListWithButtons = (
  props: VideosListWithButtonsProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <List
        videosData={props.videosData}
        onVideoItemPress={props.onVideoItemPress}
      />
      <Buttons navigateToRecordVideo={props.navigateToRecordVideo} />
    </View>
  );
};

export default ListWithButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
