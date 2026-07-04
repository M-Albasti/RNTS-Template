import React from 'react';
import {View} from 'react-native';

import AudioSubmit from '@molecules/audios/recordAudio/audioSubmit';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const SubmitSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <AudioSubmit retakeAudio={() => {}} uploadAudio={async () => {}} status="idle" />
      <AudioSubmit retakeAudio={() => {}} uploadAudio={async () => {}} status="loading" />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Audio Submit',
  sections: [{title: 'Idle and loading', content: <SubmitSection />}],
});
