//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import AudioPlayerView from '@organisms/audios/audioPlayer/AudioPlayerView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {SoundProps} from '@Types/soundProps';

interface AudioPlayerTemplateProps {
  navigation: AppStackNavigationProp<'AudioPlayer'>;
  audioDetails: SoundProps;
}

const AudioPlayerTemplate = (
  props: AudioPlayerTemplateProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <AudioPlayerView
        navigation={props.navigation}
        audioDetails={props.audioDetails}
      />
    </View>
  );
};

export default AudioPlayerTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
