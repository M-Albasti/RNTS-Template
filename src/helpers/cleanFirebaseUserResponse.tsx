import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export const cleanFirebaseUserResponse = (user: FirebaseAuthTypes.User | undefined) => {
  if (!user) return null;

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
