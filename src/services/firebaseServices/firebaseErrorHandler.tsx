//* packages import
import {Alert} from 'react-native';

//* types import
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
import type {NativeModuleError} from '@react-native-google-signin/google-signin';

export const firebaseErrorHandler = (
  error: FirebaseAuthTypes.NativeFirebaseAuthError | NativeModuleError,
) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      console.log('That email address is already in use!');
      Alert.alert(
        'Something Went Wrong',
        'That email address is already in use!\nPlease try another one.',
      );
      break;
    case 'auth/invalid-email':
      console.log('That email address is invalid!');
      Alert.alert(
        'Something Went Wrong',
        'That email address is invalid!\nPlease try another one.',
      );
      break;
    case 'auth/user-not-found':
      console.log('No user found with this email!');
      Alert.alert('Something Went Wrong', 'No user found with this email!');
      break;
    case 'auth/wrong-password':
      console.log('Incorrect password!');
      Alert.alert('Something Went Wrong', 'Incorrect password!');
      break;
    case 'auth/account-exists-with-different-credential':
      Alert.alert(
        'Account Exists',
        'An account already exists with the same email address but different sign-in credentials.',
      );
      break;
    case 'auth/popup-closed-by-user':
      Alert.alert(
        'Sign In Cancelled',
        'The sign-in popup was closed before completing the sign-in.',
      );
      break;
    case 'auth/cancelled-popup-request':
      Alert.alert('Sign In Cancelled', 'The sign-in popup was cancelled.');
      break;
    case 'auth/popup-blocked':
      Alert.alert(
        'Popup Blocked',
        'The sign-in popup was blocked by the browser.',
      );
      break;
    case 'auth/network-request-failed':
      Alert.alert(
        'Network Error',
        'A network error occurred during sign-in. Please check your internet connection.',
      );
      break;
    case 'auth/email-already-in-use':
      console.log('That email address is already in use!');
      Alert.alert(
        'Something Went Wrong',
        'That email address is already in use!\nPlease try another one.',
      );
      break;
    case 'auth/invalid-email':
      console.log('That email address is invalid!');
      Alert.alert(
        'Something Went Wrong',
        'That email address is invalid!\nPlease try another one.',
      );
      break;
    case 'auth/user-not-found':
      console.log('No user found with this email!');
      Alert.alert('Something Went Wrong', 'No user found with this email!');
      break;
    case 'auth/wrong-password':
      console.log('Incorrect password!');
      Alert.alert('Something Went Wrong', 'Incorrect password!');
      break;
    default:
      console.log('An unknown error occurred:', error.message);
      Alert.alert(
        'Something Went Wrong',
        error.message || 'An error occurred during login.',
      );
  }
  throw new Error(error.message);
};
