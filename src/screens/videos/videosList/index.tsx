//* packages import
import React from 'react';

//* components import
import VideosListTemplate from '@templates/videos/videosListTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosListProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

const VideosList = ({navigation}: VideosListProps): React.JSX.Element => {
  return <VideosListTemplate navigation={navigation} />;
};

export default VideosList;
