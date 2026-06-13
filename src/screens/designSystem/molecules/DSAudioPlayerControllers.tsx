import React, {useState} from 'react';
import {View} from 'react-native';

import AudioControllers from '@molecules/audios/audioPlayer/audioControllers';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const ControllersDemo = (): React.JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const styles = useShowcaseStack();

  return (
    <View style={styles.stack}>
      <AudioControllers
        isPlaying={isPlaying}
        repeat={repeat}
        playSound={() => setIsPlaying(true)}
        pauseSound={() => setIsPlaying(false)}
        stopSound={() => setIsPlaying(false)}
        repeatSound={() => setRepeat(prev => !prev)}
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Audio Player Controllers',
  sections: [{title: 'Interactive', content: <ControllersDemo />}],
});
