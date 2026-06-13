import React, {useState} from 'react';

import AudioPlayerView from '@organisms/audios/audioPlayer/AudioPlayerView';

import {sounds} from '@constants/sounds';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const PlayerDemo = (): React.JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);

  return (
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
  );
};

export default createShowcaseScreen({
  title: 'Audio Player View',
  sections: [{title: 'Interactive player', content: <PlayerDemo />}],
});
