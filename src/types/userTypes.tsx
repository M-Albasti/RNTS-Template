//* types import
import type {
  AdditionalUserInfo,
  User as FirebaseUser,
  UserMetadata,
} from '@Types/firebaseAuthTypes';
import {LoginTypes} from '@Types/loginTypes';

export type User = {
  uid: FirebaseUser['uid'];
  email: FirebaseUser['email'];
  displayName: FirebaseUser['displayName'];
  photoURL: FirebaseUser['photoURL'];
  phoneNumber: FirebaseUser['phoneNumber'];
  emailVerified: FirebaseUser['emailVerified'];
  providerId: FirebaseUser['providerId'];
  providerData: FirebaseUser['providerData'];
  isAnonymous: FirebaseUser['isAnonymous'];
  creationTime: UserMetadata['creationTime'];
  lastSignInTime: UserMetadata['lastSignInTime'];
  isNewUser?: AdditionalUserInfo['isNewUser'];
  username?: AdditionalUserInfo['username'];
  profile?: AdditionalUserInfo['profile'];
  loginType: LoginTypes;
};
