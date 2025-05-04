//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import ListWithButtons from '@organisms/videos/videosList/ListWithButtons';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosListTemplateProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

const VideosListTemplate = (props: VideosListTemplateProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <ListWithButtons navigation={props.navigation} />
    </View>
  );
};

export default VideosListTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
