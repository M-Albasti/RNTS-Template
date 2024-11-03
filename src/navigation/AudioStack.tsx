import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@Types/appNavigation';
import RecordAudio from '@screens/audios/recordAudio';
import AudiosList from '@screens/audios/audiosList';
import AudioPlayer from '@screens/audios/audioPlayer';

const AudioStack = createNativeStackNavigator<RootStackParamList>();

const AudioStackNavigation = (props: any): React.JSX.Element => {
  return (
    <AudioStack.Navigator
      initialRouteName="AudiosList"
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

export default AudioStackNavigation;
