import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VideosList from '@screens/videos/videosList';
import RecordVideo from '@screens/videos/recordVideo';
import VideoPlayer from '@screens/videos/videoPlayer';
import {RootStackParamList} from '@Types/appNavigation';

const VideoStack = createNativeStackNavigator<RootStackParamList>();

const VideoStackNavigation = (props: any): React.JSX.Element => {
  return (
    <VideoStack.Navigator
      initialRouteName="VideosList"
      screenOptions={{headerShown: false}}>
      <VideoStack.Group>
        <VideoStack.Screen name="VideosList">
          {props => <VideosList {...props} />}
        </VideoStack.Screen>
        <VideoStack.Screen name="RecordVideo">
          {props => <RecordVideo {...props} />}
        </VideoStack.Screen>
        <VideoStack.Screen name="VideoPlayer">
          {props => <VideoPlayer {...props} />}
        </VideoStack.Screen>
      </VideoStack.Group>
    </VideoStack.Navigator>
  );
};

export default VideoStackNavigation;
