//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import List from '@molecules/Videos/videosList/List';
import Buttons from '@molecules/Videos/videosList/Buttons';

//* constants import
import {videos} from '@constants/videos';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {VideoProps} from '@Types/videoProps';

interface VideosListWithButtonsProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

const ListWithButtons = (
  props: VideosListWithButtonsProps,
): React.JSX.Element => {
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
      <List videosData={videos} onVideoItemPress={onVideoItemPress} />
      <Buttons navigateToRecordVideo={navigateToRecordVideo} />
    </View>
  );
};

export default ListWithButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
