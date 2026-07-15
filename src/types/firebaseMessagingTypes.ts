import {AuthorizationStatus} from '@react-native-firebase/messaging';

/** Modular Firebase Messaging types (React Native Firebase v26+). */
export type {RemoteMessage} from '@react-native-firebase/messaging';

export type MessagingAuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];
