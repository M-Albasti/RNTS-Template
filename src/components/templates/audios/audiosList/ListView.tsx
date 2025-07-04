//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import ListWithButtons from '@organisms/audios/audiosList/ListWithButtons';

//* constants import
import {sounds} from '@constants/sounds';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {SoundProps} from '@Types/soundProps';

interface AudiosListViewProps {
  navigation: AppStackNavigationProp<'AudiosList'>;
}

const ListView = (props: AudiosListViewProps): React.JSX.Element => {
  const onAudioItemPress = (item: SoundProps) => {
    props.navigation.navigate('AudioPlayer', {
      audioDetails: item,
    });
  };

  const navigateToRecordAudio = () => {
    props.navigation.navigate('RecordAudio');
  };

  return (
    <View style={styles.container}>
      <ListWithButtons
        audiosData={sounds}
        onAudioItemPress={onAudioItemPress}
        navigateToRecordAudio={navigateToRecordAudio}
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
