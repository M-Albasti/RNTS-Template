//* pakages import
import React from 'react';
import {View} from 'react-native';

//* components import
import RecordVideoTemplate from '@templates/videos/recordVideoTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface RecordVideoProps {
  navigation: AppStackNavigationProp<'RecordVideo'>;
}

const RecordVideo = (props: RecordVideoProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <RecordVideoTemplate navigation={props.navigation} />
    </View>
  );
};

export default RecordVideo;
