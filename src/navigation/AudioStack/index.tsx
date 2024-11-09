import React, {Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@Types/appNavigation';
import RecordAudio from '@screens/audios/recordAudio';
import AudiosList from '@screens/audios/audiosList';
import AudioPlayer from '@screens/audios/audioPlayer';
import {Text, View} from 'react-native';
import {styles} from './styles';

const AudioStack = createNativeStackNavigator<RootStackParamList>();

const AudioStackNavigator = (props: any): React.JSX.Element => {
  return (
    <AudioStack.Navigator
      initialRouteName="AudiosList"
      layout={({children, state, descriptors, navigation}) => (
        <Suspense
          fallback={
            <View style={styles.fallback}>
              <Text style={styles.fallbackText}>Loading…</Text>
            </View>
          }>
          <View style={styles.container}>{children}</View>
        </Suspense>
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
