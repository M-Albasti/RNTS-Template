//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import VideoCameraModal from '@organisms/videos/recordVideo/VideoCameraModal';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RecordVideoTemplateProps {
  navigation: AppStackNavigationProp<'RecordVideo'>;
}

const RecordVideoTemplate = (
  props: RecordVideoTemplateProps,
): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <VideoCameraModal navigation={props.navigation} />
    </View>
  );
};

export default RecordVideoTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
