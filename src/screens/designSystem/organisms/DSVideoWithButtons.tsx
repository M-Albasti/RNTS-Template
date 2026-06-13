import React from 'react';
import {View} from 'react-native';

import VideoWithButtons from '@organisms/videos/recordVideo/VideoWithButtons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  mockVideoFile,
  recordVideoShowcaseNavigation,
} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Video With Buttons',
  sections: [
    {
      title: 'Preview + actions',
      content: (
        <View style={{height: 360}}>
          <VideoWithButtons
            videoFile={mockVideoFile}
            emptyVideoFile={() => {}}
            retakeVideo={() => {}}
            navigation={recordVideoShowcaseNavigation}
          />
        </View>
      ),
    },
  ],
});
