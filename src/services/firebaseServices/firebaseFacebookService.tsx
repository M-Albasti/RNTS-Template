//* packages import
import {Platform} from 'react-native';
import {
  FacebookAuthProvider, // Provides Facebook authentication methods
  getAuth, // Returns the default Firebase Auth instance
  signInWithCredential, // Signs in a user with a given credential
  FirebaseAuthTypes, // Type definitions for Firebase Auth
  signOut, // Signs out the current user
  deleteUser, // Deletes the current user
} from '@react-native-firebase/auth';
import {
  LoginManager, // Manages Facebook login
  AccessToken, // Gets the current Facebook access token
  AuthenticationToken, // Gets the current Facebook authentication token (iOS)
} from 'react-native-fbsdk-next';
import {sha256} from 'react-native-sha256';

//* services import
import {firebaseErrorHandler} from '@services/firebaseServices/firebaseErrorHandler';

// Export an async function to log in to Firebase using Facebook Sign-In
export const loginFirebaseWithFacebook =
  async (): Promise<FirebaseAuthTypes.UserCredential> => {
    // Set the login behavior for Facebook login
    LoginManager.setLoginBehavior('native_with_fallback');

    if (Platform.OS === 'ios') {
      // Create a nonce string using the current date and time
      const nonce = `RNTS-Template-${new Date().toISOString()}`;
      // Hash the nonce using sha256
      const nonceSha256 = await sha256(nonce);
      // Attempt Facebook login with permissions and limited login using the hashed nonce
      await LoginManager.logInWithPermissions(
        ['public_profile', 'email'], // Request public profile and email permissions
        'limited', // Use limited login
        nonceSha256, // Pass the hashed nonce
      )
        .then(result => {
          if (result.isCancelled) {
            throw 'User cancelled the login process'; // Throw if user cancels login
          }
        })
        .catch(firebaseErrorHandler); // Handle errors from Facebook login
      // Once signed in, get the user's AuthenticationToken (iOS only)
      return await AuthenticationToken.getAuthenticationTokenIOS().then(
        data => {
          if (!data) {
            throw 'Something went wrong obtaining authentication token'; // Throw if no token is found
          }
          // Create a Firebase credential with the AuthenticationToken and nonce
          const facebookCredential = FacebookAuthProvider.credential(
            data.authenticationToken, // Facebook authentication token
            nonce, // Nonce used for validation
          );

          // Sign-in the user with the credential
          return signInWithCredential(getAuth(), facebookCredential); // Sign in to Firebase with the Facebook credential
        },
      );
    } else {
      // Attempt Facebook login with permissions (Android and others)
      await LoginManager.logInWithPermissions(['public_profile', 'email'])
        .then(result => {
          if (result.isCancelled) {
            throw 'User cancelled the login process'; // Throw if user cancels login
          }
        })
        .catch(firebaseErrorHandler); // Handle errors from Facebook login

      // Once signed in, get the user's AccessToken
      return await AccessToken.getCurrentAccessToken()
        .then(data => {
          if (!data) {
            throw 'Something went wrong obtaining access token'; // Throw if no token is found
          }
          // Create a Firebase credential with the AccessToken
          const facebookCredential = FacebookAuthProvider.credential(
            data.accessToken, // Facebook access token
          );

          // Sign-in the user with the credential
          return signInWithCredential(getAuth(), facebookCredential); // Sign in to Firebase with the Facebook credential
        })
        .catch(firebaseErrorHandler); // Handle errors from getting access token
    }
  };

// Export an async function to log out the Facebook user
export const logoutFacebookUser = async (): Promise<void> => {
  await signOut(getAuth()) // Sign out from Firebase Auth
    .then(() => {
      LoginManager.logOut(); // Log out from Facebook
    })
    .catch(firebaseErrorHandler); // Handle errors from Firebase sign out
};

// Export an async function to delete the Facebook user from Firebase
export const deleteFacebookUser = async (
  user: FirebaseAuthTypes.User, // The user to delete
): Promise<void> => {
  await signOut(getAuth()) // Sign out from Firebase Auth
    .then(async () => {
      LoginManager.logOut(); // Log out from Facebook
      await deleteUser(user).catch(firebaseErrorHandler); // Delete the user from Firebase and handle errors
    })
    .catch(firebaseErrorHandler); // Handle errors from Firebase sign out
};
