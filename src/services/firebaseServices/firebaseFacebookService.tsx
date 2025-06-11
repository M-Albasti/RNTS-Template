//* packages import
import {
  FacebookAuthProvider,
  getAuth,
  signInWithCredential,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import {
  LoginManager,
  AccessToken,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import {sha256} from 'react-native-sha256';

//* services import
import {firebaseErrorHandler} from './firebaseErrorHandler';
import {Platform} from 'react-native';

export const loginFirebaseWithFacebook =
  async (): Promise<FirebaseAuthTypes.UserCredential> => {
    if (Platform.OS === 'ios') {
      // Create a nonce and the corresponding
      // sha256 hash of the nonce
      const nonce = `RNTS-Template-${new Date().toISOString()}`;
      const nonceSha256 = await sha256(nonce);
      // Attempt login with permissions and limited login
      await LoginManager.logInWithPermissions(
        ['public_profile', 'email'],
        'limited',
        nonceSha256,
      )
        .then(result => {
          if (result.isCancelled) {
            throw 'User cancelled the login process';
          }
        })
        .catch(firebaseErrorHandler);
      // Once signed in, get the users AuthenticationToken
      return await AuthenticationToken.getAuthenticationTokenIOS().then(
        data => {
          if (!data) {
            throw 'Something went wrong obtaining authentication token';
          }
          // Create a Firebase credential with the AuthenticationToken
          // and the nonce (Firebase will validates the hash against the nonce)
          const facebookCredential = FacebookAuthProvider.credential(
            data.authenticationToken,
            nonce,
          );

          // Sign-in the user with the credential
          return signInWithCredential(getAuth(), facebookCredential);
        },
      );
    } else {
      // Attempt login with permissions
      await LoginManager.logInWithPermissions(['public_profile', 'email'])
        .then(result => {
          if (result.isCancelled) {
            throw 'User cancelled the login process';
          }
        })
        .catch(firebaseErrorHandler);

      // Once signed in, get the users AccessToken
      return await AccessToken.getCurrentAccessToken()
        .then(data => {
          if (!data) {
            throw 'Something went wrong obtaining access token';
          }
          // Create a Firebase credential with the AccessToken
          const facebookCredential = FacebookAuthProvider.credential(
            data.accessToken,
          );

          // Sign-in the user with the credential
          return signInWithCredential(getAuth(), facebookCredential);
        })
        .catch(firebaseErrorHandler);
    }
  };

export const logoutFacebookUser = async (): Promise<void> => {
  try {
    LoginManager.logOut();
  } catch (error) {
    console.log('Error logoutFacebookUser:', error);
  }
};
