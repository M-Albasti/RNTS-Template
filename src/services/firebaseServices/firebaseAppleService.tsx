//* packages import
import {
  AppleAuthProvider,
  getAuth,
  revokeToken,
  signInWithCredential,
  signOut,
  type UserCredential,
} from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';

//* services import
import {firebaseErrorHandler} from '@services/firebaseServices/firebaseErrorHandler';

// Export an async function to log in to Firebase using Apple Sign-In
export const loginFirebaseWithApple =
  async (): Promise<UserCredential> => {
    // Start the sign-in request with Apple
    return await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN, // Specify the login operation
        // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
        // See: https://github.com/invertase/react-native-apple-authentication#faqs
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL], // Request full name and email scopes
      })
      .then(appleAuthRequestResponse => {
        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
          throw new Error('Apple Sign-In failed - no identify token returned'); // Throw if no identity token is found
        }

        // Create a Firebase credential from the response
        const {identityToken, nonce} = appleAuthRequestResponse; // Extract identityToken and nonce
        const appleCredential = AppleAuthProvider.credential(
          identityToken, // Apple identity token
          nonce, // Nonce for validation
        );

        // Sign the user in with the credential
        return signInWithCredential(getAuth(), appleCredential); // Sign in to Firebase with the Apple credential
      })
      .catch(firebaseErrorHandler); // Handle any errors using the firebaseErrorHandler
  };

// Export an async function to log out the Apple user
export const logoutAppleUser = async (): Promise<void> => {
  // Get an authorizationCode from Apple
  await appleAuth
    .performRequest({
      requestedOperation: appleAuth.Operation.LOGOUT, // Specify the logout operation
    })
    .then(async appleAuthRequestResponse => {
      // Ensure Apple returned an authorizationCode
      if (!appleAuthRequestResponse?.authorizationCode) {
        throw new Error(
          'Apple Revocation failed - no authorizationCode returned', // Throw if no authorization code is found
        );
      }

      // Revoke the token by signing out from Firebase Auth
      return await signOut(getAuth()).catch(firebaseErrorHandler); // Sign out from Firebase Auth and handle errors
    })
    .catch(firebaseErrorHandler); // Handle errors from Apple logout
};

// Export an async function to delete the Apple user from Firebase
export const deleteAppleUser = async (): Promise<void> => {
  // Get an authorizationCode from Apple
  await appleAuth
    .performRequest({
      requestedOperation: appleAuth.Operation.REFRESH, // Specify the refresh operation to get a new authorization code
    })
    .then(async appleAuthRequestResponse => {
      // Ensure Apple returned an authorizationCode
      if (!appleAuthRequestResponse?.authorizationCode) {
        throw new Error(
          'Apple Revocation failed - no authorizationCode returned', // Throw if no authorization code is found
        );
      }
      // Revoke the token using the authorization code
      return await revokeToken(
        getAuth(),
        appleAuthRequestResponse.authorizationCode,
      )
        .then(async () => {
          await signOut(getAuth()).catch(firebaseErrorHandler); // Sign out from Firebase Auth and handle errors
        })
        .catch(firebaseErrorHandler); // Handle errors from token revocation
    })
    .catch(firebaseErrorHandler); // Handle errors from Apple refresh
};
