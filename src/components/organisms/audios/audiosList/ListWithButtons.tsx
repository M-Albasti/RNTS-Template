//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import List from '@molecules/audios/audiosList/list';
import Buttons from '@molecules/audios/audiosList/buttons';

//* constants import
import {SoundProps} from '@constants/sounds';

interface AudiosListWithButtonsProps {
  audiosData: SoundProps[];
  onAudioItemPress: (value: SoundProps) => void;
  navigateToRecordAudio: () => void;
}

const ListWithButtons = (
  props: AudiosListWithButtonsProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <List
        audiosData={props.audiosData}
        onAudioItemPress={props.onAudioItemPress}
      />
      <Buttons navigateToRecordAudio={props.navigateToRecordAudio} />
    </View>
  );
};

export default ListWithButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
