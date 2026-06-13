import React from 'react';
import {View} from 'react-native';

import AudiosListWithButtons from '@organisms/audios/audiosList/ListWithButtons';

import {sounds} from '@constants/sounds';
import {useThemedStyles} from '@theme/createThemedStyles';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {audiosListShowcaseNavigation} from '../shared/showcaseHelpers';

const AudiosListPreview = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    container: {height: tokens.sizes.videoPreviewLg},
  }));

  return (
    <View style={styles.container}>
      <AudiosListWithButtons
        navigation={audiosListShowcaseNavigation}
        audiosData={sounds.slice(0, 5)}
      />
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Audios List With Buttons',
  sections: [
    {
      title: 'List + record button',
      content: <AudiosListPreview />,
    },
  ],
});
