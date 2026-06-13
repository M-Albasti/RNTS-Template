import React from 'react';
import {View} from 'react-native';

import VideoPlayerButtons from '@molecules/videos/videoPlayer/buttons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';

const ButtonsSection = (): React.JSX.Element => {
  const styles = useShowcaseStack();
  return (
    <View style={styles.stack}>
      <VideoPlayerButtons
        onDismiss={() => {}}
        onRetakeVideo={() => {}}
        onUpload={() => {}}
      />
      <VideoPlayerButtons
        onDismiss={() => {}}
        onRetakeVideo={() => {}}
        onUpload={() => {}}
        uploading
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Video Player Buttons',
  sections: [{title: 'Default and uploading', content: <ButtonsSection />}],
});
