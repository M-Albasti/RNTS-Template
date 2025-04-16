//* packages import
import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//* screens import
import VideosList from '@screens/videos/videosList';
import RecordVideo from '@screens/videos/recordVideo';
import VideoPlayer from '@screens/videos/videoPlayer';

//* components import
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

//* types import
import {RootStackParamList} from '@Types/appNavigation';

//* styles import
import {styles} from './styles';

const VideoStack = createNativeStackNavigator<RootStackParamList>();

const VideoStackNavigator = (props: any): React.JSX.Element => {
  return (
    <VideoStack.Navigator
      initialRouteName="VideosList"
      layout={({children, state, descriptors, navigation}) => (
        <ErrorBoundary>
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
        </ErrorBoundary>
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
