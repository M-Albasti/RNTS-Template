import React from 'react';
import {View} from 'react-native';

import ScreenHeader from '@atoms/ScreenHeader';
import VideosListWithButtons from '@organisms/videos/videosList/ListWithButtons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {videosListShowcaseNavigation} from '../shared/showcaseHelpers';
import {sizes} from '@theme/tokens/sizes';

const VideosListContent = (): React.JSX.Element => (
  <>
    <ScreenHeader title="Videos" onBack={() => {}} />
    <View style={{height: sizes.videoPreviewLg}}>
      <VideosListWithButtons navigation={videosListShowcaseNavigation} />
    </View>
  </>
);

export default createShowcaseScreen({
  title: 'Videos List Template',
  sections: [{title: 'List screen content', content: <VideosListContent />}],
});
