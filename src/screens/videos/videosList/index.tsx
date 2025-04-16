//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import ListView from '@templates/videos/videosList/ListView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

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
