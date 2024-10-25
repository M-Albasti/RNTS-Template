import React from 'react';
import {View} from 'react-native';
import VideoRecord from '@templates/VideoRecord';

const Video = (props: any) => {
  return (
    <View style={{flex: 1}}>
      <VideoRecord />
    </View>
  );
};

export default Video;
