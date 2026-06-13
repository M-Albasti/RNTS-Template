import React from 'react';
import {View} from 'react-native';

import VideoWithButtons from '@organisms/videos/recordVideo/VideoWithButtons';

import {useThemedStyles} from '@theme/createThemedStyles';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  mockVideoFile,
  recordVideoShowcaseNavigation,
} from '../shared/showcaseHelpers';

const VideoWithButtonsPreview = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    container: {height: tokens.sizes.videoPreviewLg},
  }));

  return (
    <View style={styles.container}>
      <VideoWithButtons
        videoFile={mockVideoFile}
        emptyVideoFile={() => {}}
        retakeVideo={() => {}}
        navigation={recordVideoShowcaseNavigation}
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Video With Buttons',
  sections: [
    {
      title: 'Preview + actions',
      content: <VideoWithButtonsPreview />,
    },
  ],
});
