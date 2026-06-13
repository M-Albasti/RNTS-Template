import React from 'react';
import {View} from 'react-native';

import ScreenHeader from '@atoms/ScreenHeader';
import AudiosListWithButtons from '@organisms/audios/audiosList/ListWithButtons';

import {sounds} from '@constants/sounds';
import {useThemedStyles} from '@theme/createThemedStyles';
import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {audiosListShowcaseNavigation} from '../shared/showcaseHelpers';

const AudiosListContent = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    container: {height: tokens.sizes.videoPreviewLg},
  }));

  return (
    <>
      <ScreenHeader title="Audios" onBack={() => {}} />
      <View style={styles.container}>
        <AudiosListWithButtons
          navigation={audiosListShowcaseNavigation}
          audiosData={sounds}
        />
      </View>
    </>
  );
};

export default createShowcaseScreen({
  title: 'Audios List Template',
  sections: [{title: 'List screen content', content: <AudiosListContent />}],
});
