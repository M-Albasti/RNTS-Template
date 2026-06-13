import React from 'react';
import {View} from 'react-native';

import RecordAudioView from '@organisms/audios/recordAudio/RecordAudioView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {recordAudioShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Record Audio View',
  subtitle: 'Uses useAudioRecorder — mic permission required on device.',
  sections: [
    {
      title: 'Full recorder UI',
      content: (
        <View style={{minHeight: 400}}>
          <RecordAudioView navigation={recordAudioShowcaseNavigation} />
        </View>
      ),
    },
  ],
});
