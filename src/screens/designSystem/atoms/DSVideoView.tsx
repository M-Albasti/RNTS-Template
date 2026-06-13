import React from 'react';
import {View} from 'react-native';

import TextView from '@atoms/TextView';
import VideoView from '@atoms/VideoView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {sizes} from '@theme/tokens/sizes';

const SAMPLE_URI =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const VideoSection = (): React.JSX.Element => (
  <View style={{height: sizes.videoPreview}}>
    <VideoView uri={SAMPLE_URI} onVideoReady={() => {}} paused controls />
  </View>
);

export default createShowcaseScreen({
  title: 'Video View',
  subtitle: 'Sample remote MP4 — requires network in dev.',
  sections: [
    {title: 'Sample URI', content: <VideoSection />},
    {
      title: 'Note',
      content: (
        <TextView
          text="If video fails to load offline, the player still demonstrates layout and props."
          variant="bodySmall"
          muted
        />
      ),
    },
  ],
});
