import React from 'react';
import {View} from 'react-native';
import VideoRecord from '@templates/videos/VideoRecord';
import {styles} from './styles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface RecordVideoProps {
  navigation: AppStackNavigationProp<'RecordVideo'>;
}

const RecordVideo = (props: RecordVideoProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <VideoRecord navigation={props.navigation} />
    </View>
  );
};

export default RecordVideo;
