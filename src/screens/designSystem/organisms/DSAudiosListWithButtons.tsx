import React from 'react';
import {View} from 'react-native';

import AudiosListWithButtons from '@organisms/audios/audiosList/ListWithButtons';

import {sounds} from '@constants/sounds';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {audiosListShowcaseNavigation} from '../shared/showcaseHelpers';

export default createShowcaseScreen({
  title: 'Audios List With Buttons',
  sections: [
    {
      title: 'List + record button',
      content: (
        <View style={{height: 360}}>
          <AudiosListWithButtons
            navigation={audiosListShowcaseNavigation}
            audiosData={sounds.slice(0, 5)}
          />
        </View>
      ),
    },
  ],
});
