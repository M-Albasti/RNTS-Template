import React from 'react';
import {View} from 'react-native';

import VideosListWithButtons from '@organisms/videos/videosList/ListWithButtons';

import {videos} from '@constants/videos';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveDSVideosListWithButtonsStyles} from './styles/resolveDSVideosListWithButtonsStyles';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {videosListShowcaseNavigation} from '../shared/showcaseHelpers';

const VideosListPreview = (): React.JSX.Element => {
  const styles = useThemedStyles(resolveDSVideosListWithButtonsStyles);

  return (
    <View style={styles.container}>
      <VideosListWithButtons
        navigation={videosListShowcaseNavigation}
        videosData={videos.slice(0, 4)}
      />
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
