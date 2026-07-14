//* types import
import type {
  AdditionalUserInfo,
  User as FirebaseUser,
} from '@Types/firebaseAuthTypes';
import {LoginTypes} from '@Types/loginTypes';
import {User} from '@Types/userTypes';

export const cleanFirebaseUserResponse = (
  user: FirebaseUser,
  loginType: LoginTypes,
  additionalUserInfo?: AdditionalUserInfo,
): User | null => {
  if (!user) return null;

  return {
    uid: user?.uid,
    email: user?.email,
    displayName: user?.displayName,
    photoURL: user?.photoURL,
    phoneNumber: user?.phoneNumber,
    emailVerified: user?.emailVerified,
    providerId: user?.providerId,
    providerData: user?.providerData,
    isAnonymous: user?.isAnonymous,
    creationTime: user?.metadata?.creationTime,
    lastSignInTime: user?.metadata?.lastSignInTime,
    isNewUser: additionalUserInfo?.isNewUser,
    username: additionalUserInfo?.username,
    profile: additionalUserInfo?.profile,
    loginType: loginType,
  };
};
