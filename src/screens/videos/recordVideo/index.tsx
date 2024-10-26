import React from 'react';
import {View} from 'react-native';
import VideoRecord from '@templates/VideoRecord';

const Video = (props: any): React.JSX.Element => {
  return (
    <View style={{flex: 1}}>
      <VideoRecord />
    </View>
  );
};

export default Video;
