import React from 'react';
import {View} from 'react-native';
import VideosListView from '@templates/videos/VideosListView';
import {styles} from './styles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosMenuProps {
  navigation: AppStackNavigationProp<'VideosMenu'>;
}

const VideosMenu = (props: VideosMenuProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <VideosListView navigation={props.navigation} />
    </View>
  );
};

export default VideosMenu;
