//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import VideosListTemplate from '@templates/videos/videosListTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface VideosListProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

const VideosList = (props: VideosListProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <VideosListTemplate navigation={props.navigation} />
    </View>
  );
};

export default VideosList;
