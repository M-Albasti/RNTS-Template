import React, {Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@Types/appNavigation';
import RecordAudio from '@screens/audios/recordAudio';
import AudiosList from '@screens/audios/audiosList';
import AudioPlayer from '@screens/audios/audioPlayer';
import {View} from 'react-native';
import {styles} from './styles';
import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

const AudioStack = createNativeStackNavigator<RootStackParamList>();

const AudioStackNavigator = (props: any): React.JSX.Element => {
  return (
    <AudioStack.Navigator
      initialRouteName="AudiosList"
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
      <AudioStack.Group>
        <AudioStack.Screen name="AudiosList">
          {props => <AudiosList {...props} />}
        </AudioStack.Screen>
        <AudioStack.Screen name="RecordAudio">
          {props => <RecordAudio {...props} />}
        </AudioStack.Screen>
        <AudioStack.Screen name="AudioPlayer">
          {props => <AudioPlayer {...props} />}
        </AudioStack.Screen>
      </AudioStack.Group>
    </AudioStack.Navigator>
  );
};

export default AudioStackNavigator;
