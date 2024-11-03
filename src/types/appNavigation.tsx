import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {VideoProps} from '@constants/videos';
import {SoundProps} from '@constants/sounds';

export type RootStackParamList = {
  Home: undefined; // No params
  Details: undefined; // Params for Details screen
  VideosList: undefined;
  VideoPlayer: {videoDetails: VideoProps};
  RecordVideo: undefined;
  RecordAudio: undefined;
  AudioPlayer: {audioDetails: SoundProps};
  AudiosList: undefined;
};

// Define a global type for StackNavigationProp
export type AppStackNavigationProp<
  ScreenName extends keyof RootStackParamList,
> = NativeStackNavigationProp<RootStackParamList, ScreenName>;

// Define a global type for RouteProp
export type AppRouteProp<Prop extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  Prop
>;
