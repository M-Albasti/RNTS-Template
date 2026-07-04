import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
import type {VideoFile} from 'react-native-vision-camera';

import {videos} from '@constants/videos';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveShowcaseHelpersStyles} from './styles/resolveShowcaseHelpersStyles';

import type {
  AppStackNavigationProp,
  RootStackParamList,
} from '@Types/appNavigation';
import type {
  DesignSystemRouteName,
  DesignSystemStackParamList,
} from '@Types/designSystemNavigation';
import type {LoginScreens} from '@Types/loginScreens';
import type {RegisterScreens} from '@Types/registerScreens';

const noop = (): void => {};

const mockNavigationShell = {
  goBack: noop,
  navigate: noop,
  replace: noop,
  reset: noop,
  setParams: noop,
  setOptions: noop,
  dispatch: noop,
  isFocused: () => true,
  canGoBack: () => false,
  addListener: () => noop,
  removeListener: noop,
  getParent: () => undefined,
  getId: () => undefined,
};

/** Typed navigation stub for previewing components that require `navigation`. */
export const asShowcaseNavigation = <
  T extends keyof RootStackParamList = keyof RootStackParamList,
>(): AppStackNavigationProp<T> =>
  mockNavigationShell as unknown as AppStackNavigationProp<T>;

export const loginShowcaseNavigation =
  asShowcaseNavigation<LoginScreens>();
export const registerShowcaseNavigation =
  asShowcaseNavigation<RegisterScreens>();
export const videosListShowcaseNavigation =
  asShowcaseNavigation<'VideosList'>();
export const videoPlayerShowcaseNavigation =
  asShowcaseNavigation<'VideoPlayer'>();
export const recordVideoShowcaseNavigation =
  asShowcaseNavigation<'RecordVideo'>();
export const recordAudioShowcaseNavigation =
  asShowcaseNavigation<'RecordAudio'>();
export const audiosListShowcaseNavigation =
  asShowcaseNavigation<'AudiosList'>();
export const audioPlayerShowcaseNavigation =
  asShowcaseNavigation<'AudioPlayer'>();
export const firebasePhoneOtpShowcaseNavigation =
  asShowcaseNavigation<'FirebasePhoneOTP'>();
export const authMethodShowcaseNavigation =
  asShowcaseNavigation<'AuthMethod'>();
export const firebaseLoginMethodShowcaseNavigation =
  asShowcaseNavigation<'FirebaseLoginMethod'>();

/** @deprecated Prefer a screen-specific export from this module. */
export const mockNavigation = loginShowcaseNavigation;

export const mockRegisterRoute: RouteProp<
  RootStackParamList,
  RegisterScreens
> = {
  key: 'design-system-register',
  name: 'Register',
  params: undefined,
};

export const mockFirebaseConfirmation =
  mockNavigationShell as unknown as FirebaseAuthTypes.ConfirmationResult;

export const mockVideoFile: VideoFile = {
  path: videos[0].sources[0],
  duration: 60,
  width: 1280,
  height: 720,
} as VideoFile;

export const navigateDesignSystemShowcase = (
  navigation: NativeStackNavigationProp<
    DesignSystemStackParamList,
    'DesignSystemHub'
  >,
  route: DesignSystemRouteName,
): void => {
  const navigate = navigation.navigate as (
    screen: DesignSystemRouteName,
  ) => void;
  navigate(route);
};

export const useShowcaseStack = () =>
  useThemedStyles(resolveShowcaseHelpersStyles);
