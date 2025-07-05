//* config import
import '@config/googleSignInConfig';

//* packages import
import {
  GoogleAuthProvider, // Provides Google authentication methods
  getAuth, // Returns the default Firebase Auth instance
  signInWithCredential, // Signs in a user with a given credential
  FirebaseAuthTypes, // Type definitions for Firebase Auth
  signOut, // Signs out the current user
  deleteUser, // Deletes the current user
} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

//* services import
import {firebaseErrorHandler} from '@services/firebaseServices/firebaseErrorHandler';

// Export an async function to log in to Firebase using Google Sign-In
export const loginFirebaseWithGoogle =
  async (): Promise<FirebaseAuthTypes.UserCredential> => {
    // Check if the device supports Google Play Services and prompt to update if needed
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Start the Google Sign-In process and handle the result
    return await GoogleSignin.signIn()
      .then(signInResult => {
        // Try the new style of google-sign in result, from v13+ of that module
        const idToken = signInResult.data?.idToken; // Extract the ID token from the sign-in result
        if (!idToken) {
          throw new Error('No ID token found'); // Throw an error if no ID token is found
        }

        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(
          signInResult?.data?.idToken, // Use the ID token to create the credential
        );

        // Sign-in the user with the credential
        return signInWithCredential(getAuth(), googleCredential); // Sign in to Firebase with the Google credential
      })
      .catch(firebaseErrorHandler); // Handle any errors using the firebaseErrorHandler
  };

// Export an async function to log out the Google user
export const logoutGoogleUser = async (): Promise<void> => {
  await GoogleSignin.revokeAccess() // Revoke the app's access to the user's Google account
    .then(async () => {
      await GoogleSignin.signOut() // Sign out from Google
        .then(async () => {
          await signOut(getAuth()).catch(firebaseErrorHandler); // Sign out from Firebase Auth and handle errors
        })
        .catch(firebaseErrorHandler); // Handle errors from Google sign out
    })
    .catch(firebaseErrorHandler); // Handle errors from revoking access
};

// Export an async function to delete the Google user from Firebase
export const deleteGoogleUser = async (
  user: FirebaseAuthTypes.User, // The user to delete
): Promise<void> => {
  await GoogleSignin.revokeAccess() // Revoke the app's access to the user's Google account
    .then(async () => {
      await GoogleSignin.signOut() // Sign out from Google
        .then(async () => {
          await signOut(getAuth()) // Sign out from Firebase Auth
            .then(async () => {
              await deleteUser(user).catch(firebaseErrorHandler); // Delete the user from Firebase and handle errors
            })
            .catch(firebaseErrorHandler); // Handle errors from Firebase sign out
        })
        .catch(firebaseErrorHandler); // Handle errors from Google sign out
    })
    .catch(firebaseErrorHandler); // Handle errors from revoking access
};
