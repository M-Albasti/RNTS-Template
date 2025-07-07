//* packages import
import React from 'react';

//* components import
import VideoContainer from '@molecules/videos/videoPlayer/videoContainer';

//* hooks import
import {useVideoContainer} from '@hooks/useVideoContainer';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {VideoProps} from '@Types/videoProps';

interface VideoPlayerViewProps {
  navigation: AppStackNavigationProp<'VideoPlayer'>;
  videoDetails: VideoProps;
}

const VideoPlayerView = (props: VideoPlayerViewProps): React.JSX.Element => {
  const {fullscreen, repeat, onVideoReady, onError} = useVideoContainer();

  return (
    <VideoContainer
      videoFileUri={props.videoDetails.sources[0]}
      onVideoReady={onVideoReady}
      onError={onError}
      fullscreen={fullscreen}
      repeat={repeat}
      controls={true}
    />
  );
};

export default VideoPlayerView;
