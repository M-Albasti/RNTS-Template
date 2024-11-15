import React, {Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VideosList from '@screens/videos/videosList';
import RecordVideo from '@screens/videos/recordVideo';
import VideoPlayer from '@screens/videos/videoPlayer';
import {RootStackParamList} from '@Types/appNavigation';
import {View} from 'react-native';
import {styles} from './styles';
import TextView from '@atoms/TextView';

const VideoStack = createNativeStackNavigator<RootStackParamList>();

const VideoStackNavigator = (props: any): React.JSX.Element => {
  return (
    <VideoStack.Navigator
      initialRouteName="VideosList"
      layout={({children, state, descriptors, navigation}) => (
        <Suspense
          fallback={
            <TextView
              text={'Loading...'}
              style={styles.fallbackText}
              containerStyle={styles.fallback}
            />
          }>
          <View style={styles.container}>{children}</View>
        </Suspense>
      )}
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

export default VideoStackNavigator;
