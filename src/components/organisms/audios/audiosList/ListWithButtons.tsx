//* packages import
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import List from '@molecules/audios/audiosList/list';
import Buttons from '@molecules/audios/audiosList/buttons';

//* types import
import {SoundProps} from '@Types/soundProps';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AudiosListWithButtonsProps {
  navigation: AppStackNavigationProp<'AudiosList'>;
  audiosData: SoundProps[];
}

const ListWithButtons = (
  props: AudiosListWithButtonsProps,
): React.JSX.Element => {
  const onAudioItemPress = useCallback(
    (item: SoundProps) => {
      props.navigation.navigate('AudioPlayer', {
        audioDetails: item,
      });
    },
    [props.navigation],
  );

  const navigateToRecordAudio = useCallback(() => {
    props.navigation.navigate('RecordAudio');
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <List audiosData={props.audiosData} onAudioItemPress={onAudioItemPress} />
      <Buttons navigateToRecordAudio={navigateToRecordAudio} />
    </View>
  );
};

export default ListWithButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
