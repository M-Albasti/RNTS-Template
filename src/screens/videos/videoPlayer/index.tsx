//* packages import
import React from 'react';
import {View} from 'react-native';

//* components import
import VideoPlayerTemplate from '@templates/videos/videoPlayerTemplate';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

interface VideoPlayerProps {
  navigation: AppStackNavigationProp<'VideoPlayer'>;
  route: AppRouteProp<'VideoPlayer'>;
}

const VideoPlayer = (props: VideoPlayerProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <VideoPlayerTemplate
        navigation={props.navigation}
        videoDetails={props.route.params.videoDetails}
      />
    </View>
  );
};

export default VideoPlayer;
