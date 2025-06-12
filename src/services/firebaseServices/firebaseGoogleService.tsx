//* config import
import '@config/googleSignInConfig';

//* packages import
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  FirebaseAuthTypes,
  signOut,
} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

//* services import
import {firebaseErrorHandler} from './firebaseErrorHandler';

export const loginFirebaseWithGoogle =
  async (): Promise<FirebaseAuthTypes.UserCredential> => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    return await GoogleSignin.signIn()
      .then(signInResult => {
        // Try the new style of google-sign in result, from v13+ of that module
        const idToken = signInResult.data?.idToken;
        if (!idToken) {
          throw new Error('No ID token found');
        }

        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(
          signInResult?.data?.idToken,
        );

        // Sign-in the user with the credential
        return signInWithCredential(getAuth(), googleCredential);
      })
      .catch(firebaseErrorHandler);
  };

export const logoutGoogleUser = async (): Promise<void> => {
  await GoogleSignin.revokeAccess()
    .then(async () => {
      await GoogleSignin.signOut()
        .then(async () => {
          await signOut(getAuth()).catch(firebaseErrorHandler);
        })
        .catch(firebaseErrorHandler);
    })
    .catch(firebaseErrorHandler);
};
