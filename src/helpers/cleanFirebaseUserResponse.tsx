//* types import
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {LoginTypes} from '@Types/loginTypes';
import {User} from '@Types/userTypes';

export const cleanFirebaseUserResponse = (
  user: FirebaseAuthTypes.User,
  loginType: LoginTypes,
  additionalUserInfo?: FirebaseAuthTypes.AdditionalUserInfo,
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
