import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {AppStackNavigationProp} from '@Types/appNavigation';
import ListView from '@templates/audios/audiosList/ListView';

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
