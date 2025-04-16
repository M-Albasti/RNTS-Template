import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export const cleanFirebaseUser = (user: FirebaseAuthTypes.User) => {
  if (!user) return {};

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
    emailVerified: user.emailVerified,
    providerId: user.providerId,
    creationTime: user.metadata?.creationTime,
    lastSignInTime: user.metadata?.lastSignInTime,
  };
};
