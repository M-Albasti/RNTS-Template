import React from 'react';
import {View} from 'react-native';

import AudiosListList from '@molecules/audios/audiosList/list';

import {sounds} from '@constants/sounds';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {sizes} from '@theme/tokens/sizes';

export default createShowcaseScreen({
  title: 'Audios List',
  sections: [
    {
      title: 'FlashList sample',
      content: (
        <View style={{height: sizes.mapPreview}}>
          <AudiosListList
            audiosData={sounds.slice(0, 4)}
            onAudioItemPress={() => {}}
          />
        </View>
      ),
    },
  ],
});
