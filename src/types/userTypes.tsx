//* types import
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {LoginTypes} from '@Types/loginTypes';

export type User = {
  uid: FirebaseAuthTypes.User['uid'];
  email: FirebaseAuthTypes.User['email'];
  displayName: FirebaseAuthTypes.User['displayName'];
  photoURL: FirebaseAuthTypes.User['photoURL'];
  phoneNumber: FirebaseAuthTypes.User['phoneNumber'];
  emailVerified: FirebaseAuthTypes.User['emailVerified'];
  providerId: FirebaseAuthTypes.User['providerId'];
  providerData: FirebaseAuthTypes.User['providerData'];
  isAnonymous: FirebaseAuthTypes.User['isAnonymous'];
  creationTime: FirebaseAuthTypes.UserMetadata['creationTime'];
  lastSignInTime: FirebaseAuthTypes.UserMetadata['lastSignInTime'];
  isNewUser?: FirebaseAuthTypes.AdditionalUserInfo['isNewUser'];
  username?: FirebaseAuthTypes.AdditionalUserInfo['username'];
  profile?: FirebaseAuthTypes.AdditionalUserInfo['profile'];
  loginType: LoginTypes;
};
