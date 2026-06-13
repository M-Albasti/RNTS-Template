import React from 'react';
import {View} from 'react-native';

import AudiosListList from '@molecules/audios/audiosList/list';

import {sounds} from '@constants/sounds';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';

export default createShowcaseScreen({
  title: 'Audios List',
  sections: [
    {
      title: 'FlashList sample',
      content: (
        <View style={{height: 280}}>
          <AudiosListList
            audiosData={sounds.slice(0, 4)}
            onAudioItemPress={() => {}}
          />
        </View>
      ),
    },
  ],
});
