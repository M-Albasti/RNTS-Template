import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import VideosListWithButtons from '@organisms/videos/VideosListWithButtons';
import {VideoProps, videos} from '@constants/videos';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosListViewProps {
  navigation: AppStackNavigationProp<'VideosMenu'>;
}

const VideosListView = (props: VideosListViewProps) => {
  const onVideoItemPress = (item: VideoProps) => {
    props.navigation.navigate('VideoPlayer', {
      videoDetails: item,
    });
  };

  const navigateToRecordVideo = () => {
    props.navigation.navigate('RecordVideo');
  };

  return (
    <View style={styles.container}>
      <VideosListWithButtons
        videosData={videos}
        onVideoItemPress={onVideoItemPress}
        navigateToRecordVideo={navigateToRecordVideo}
      />
    </View>
  );
};

export default VideosListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
