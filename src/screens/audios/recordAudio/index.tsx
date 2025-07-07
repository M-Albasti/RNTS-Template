//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import RecordAudioTemplate from '@templates/audios/recordAudioTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface RecordAudioProps {
  navigation: AppStackNavigationProp<'RecordAudio'>;
}

const RecordAudio = (props: RecordAudioProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <RecordAudioTemplate navigation={props.navigation} />
    </View>
  );
};

export default RecordAudio;
