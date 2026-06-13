import React, {useState} from 'react';

import AudioProgressBar from '@molecules/audios/audioPlayer/audioProgressBar';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';

const ProgressDemo = (): React.JSX.Element => {
  const [currentTime, setCurrentTime] = useState(30);
  return (
    <AudioProgressBar
      currentTime={currentTime}
      duration={149}
      onSeekSound={setCurrentTime}
    />
  );
};

export default createShowcaseScreen({
  title: 'Audio Progress Bar',
  sections: [{title: 'Seekable slider', content: <ProgressDemo />}],
});
