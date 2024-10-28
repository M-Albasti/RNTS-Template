import React from 'react';
import {View} from 'react-native';
import ListView from '@templates/videos/videosList/ListView';
import {styles} from './styles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosMenuProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

const VideosList = (props: VideosMenuProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <ListView navigation={props.navigation} />
    </View>
  );
};

export default VideosList;
