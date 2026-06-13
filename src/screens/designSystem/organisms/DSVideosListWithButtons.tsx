import React from 'react';
import {View} from 'react-native';

import VideosListWithButtons from '@organisms/videos/videosList/ListWithButtons';

import {useThemedStyles} from '@theme/createThemedStyles';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {videosListShowcaseNavigation} from '../shared/showcaseHelpers';

const VideosListPreview = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    container: {height: tokens.sizes.videoPreviewLg},
  }));

  return (
    <View style={styles.container}>
      <VideosListWithButtons navigation={videosListShowcaseNavigation} />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Videos List With Buttons',
  sections: [
    {
      title: 'List + record button',
      content: <VideosListPreview />,
    },
  ],
});
