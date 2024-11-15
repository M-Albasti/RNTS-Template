import {StyleSheet, View} from 'react-native';
import React from 'react';
import ListWithButtons from '@organisms/videos/videosList/ListWithButtons';
import {VideoProps, videos} from '@constants/videos';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosListViewProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

const ListView = (props: VideosListViewProps): React.JSX.Element => {
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
      <ListWithButtons
        videosData={videos}
        onVideoItemPress={onVideoItemPress}
        navigateToRecordVideo={navigateToRecordVideo}
      />
    </View>
  );
};

export default ListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
