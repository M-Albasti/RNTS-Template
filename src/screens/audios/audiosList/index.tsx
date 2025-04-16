//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import ListView from '@templates/audios/audiosList/ListView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface AudiosMenuProps {
  navigation: AppStackNavigationProp<'AudiosList'>;
}

const AudiosList = (props: AudiosMenuProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <ListView navigation={props.navigation} />
    </View>
  );
};

export default AudiosList;
