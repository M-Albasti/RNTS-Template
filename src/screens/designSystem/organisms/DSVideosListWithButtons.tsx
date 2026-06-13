import React from 'react';
import {View} from 'react-native';

import VideosListWithButtons from '@organisms/videos/videosList/ListWithButtons';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {videosListShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Videos List With Buttons',
  sections: [
    {
      title: 'List + record button',
      content: (
        <View style={{height: 360}}>
          <VideosListWithButtons navigation={videosListShowcaseNavigation} />
        </View>
      ),
    },
  ],
});
