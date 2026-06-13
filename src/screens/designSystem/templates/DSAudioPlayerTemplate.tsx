import React, {useState} from 'react';
import {View} from 'react-native';

import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import AudioPlayerView from '@organisms/audios/audioPlayer/AudioPlayerView';

import {sounds} from '@constants/sounds';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useThemedStyles} from '@theme/createThemedStyles';

const AudioPlayerContent = (): React.JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(30);
  const styles = useThemedStyles(tokens => ({
    playerCard: {
      flex: tokens.layout.flex.fill,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      paddingVertical: tokens.spacing.lg,
      ...tokens.shadows.md,
    },
  }));

  return (
    <>
      <ScreenHeader title={sounds[0].title} onBack={() => {}} />
      <Spacer size="md" />
      <View style={[styles.playerCard, {minHeight: 420}]}>
        <AudioPlayerView
          audioDetails={sounds[0]}
          loadError={null}
          isPlaying={isPlaying}
          repeat={repeat}
          currentTime={currentTime}
          duration={sounds[0].duration ?? 149}
          playSound={() => setIsPlaying(true)}
          pauseSound={() => setIsPlaying(false)}
          stopSound={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          repeatSound={() => setRepeat(prev => !prev)}
          onSeekSound={setCurrentTime}
        />
      </View>
    </>
  );
};

export default createShowcaseScreen({
  title: 'Audio Player Template',
  sections: [{title: 'Player screen content', content: <AudioPlayerContent />}],
});
