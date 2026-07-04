//* packages import
import React from 'react';

//* components import
import VideoPlayerTemplate from '@templates/videos/videoPlayerTemplate';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface VideoPlayerProps {
  navigation: AppStackNavigationProp<'VideoPlayer'>;
  route: AppRouteProp<'VideoPlayer'>;
}

const VideoPlayer = ({navigation, route}: VideoPlayerProps): React.JSX.Element => {
  return (
    <VideoPlayerTemplate
      navigation={navigation}
      videoDetails={route.params.videoDetails}
    />
  );
};

export default VideoPlayer;
