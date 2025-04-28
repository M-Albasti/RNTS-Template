//* packages import
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';

//* constants import
import {VideoProps} from '@constants/videos';
import {SoundProps} from '@constants/sounds';

export type RootStackParamList = {
  AuthStack: undefined;
  FirebaseAuthStack: undefined;
  OnBoarding: undefined;
  AuthMethod: undefined;
  FirebaseLoginMethod: undefined;
  Login: undefined;
  FirebaseEmailLogin: undefined;
  FirebaseEmailRegister: undefined;
  FirebasePhoneLogin: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  ResetPassword: undefined;
  OTP: undefined;
  FirebasePhoneOTP: {confirmation: FirebaseAuthTypes.ConfirmationResult};
  NotFound: undefined;
  Settings: undefined;
  DrawerRoot: undefined;
  TabRoot: undefined;
  Home: undefined;
  Profile: undefined;
  AudioStack: undefined;
  VideoStack: undefined;
  Details: undefined;
  PopUp: undefined;
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
