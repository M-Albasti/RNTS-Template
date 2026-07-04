import React from 'react';
import {View} from 'react-native';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import VideoPlayerView from '@organisms/videos/videoPlayer/VideoPlayerView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveVideoPlayerTemplateStyles} from './styles/resolveVideoPlayerTemplateStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';
import {VideoProps} from '@Types/videoProps';

interface VideoPlayerTemplateProps {
  navigation: AppStackNavigationProp<'VideoPlayer'>;
  videoDetails: VideoProps;
}

const VideoPlayerTemplate = ({
  navigation,
  videoDetails,
}: VideoPlayerTemplateProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveVideoPlayerTemplateStyles);

  return (
    <ScreenContainer>
      <ScreenHeader
        title={videoDetails.title || 'Video player'}
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.player}>
        <VideoPlayerView navigation={navigation} videoDetails={videoDetails} />
      </View>
    </ScreenContainer>
  );
};

export default VideoPlayerTemplate;
