//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import ListWithButtons from '@organisms/audios/audiosList/ListWithButtons';

//* constants import
import {sounds} from '@constants/sounds';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AudiosListTemplateProps {
  navigation: AppStackNavigationProp<'AudiosList'>;
}

const AudiosListTemplate = (
  props: AudiosListTemplateProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <ListWithButtons navigation={props.navigation} audiosData={sounds} />
    </View>
  );
};

export default AudiosListTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
