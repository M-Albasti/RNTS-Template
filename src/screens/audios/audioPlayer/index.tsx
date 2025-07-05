//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import AudioPlayerTemplate from '@templates/audios/audioPlayerTemplate';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface AudioPlayerProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
  route: AppRouteProp<'AudioPlayer'>;
}

const AudioPlayer = (props: AudioPlayerProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <AudioPlayerTemplate
        navigation={props.navigation}
        audioDetails={props.route.params.audioDetails}
      />
    </View>
  );
};

export default AudioPlayer;
