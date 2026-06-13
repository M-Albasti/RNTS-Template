import React from 'react';
import {View} from 'react-native';

import RecordAudioView from '@organisms/audios/recordAudio/RecordAudioView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {recordAudioShowcaseNavigation} from '../shared/showcaseHelpers';
import {sizes} from '@theme/tokens/sizes';

const RecordAudioContent = (): React.JSX.Element => (
  <View style={{minHeight: sizes.showcaseRecordMin}}>
    <RecordAudioView navigation={recordAudioShowcaseNavigation} />
  </View>
);

export default createShowcaseScreen({
  title: 'Record Audio Template',
  subtitle: 'Recorder organism — mic permission required on device.',
  sections: [{title: 'Recorder content', content: <RecordAudioContent />}],
});
