import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Alert} from 'react-native';

// Enable force reCAPTCHA flow for testing
// auth().settings.forceRecaptchaFlowForTesting = true;
// Disable app verification reCAPTCHA flow for testing
auth().settings.appVerificationDisabledForTesting = true;

/**
 * Sends a verification code to the given phone number.
 * @param phoneNumber - The phone number to send the verification code to.
 * @returns A confirmation result to verify the code.
 */
export const loginFirebaseWithPhoneNumber = async (phoneNumber: string) => {
  return await auth()
    .signInWithPhoneNumber(phoneNumber)
    .then(confirmation => {
      return confirmation;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      console.error('Error sending verification code:', error);
      throw error;
    });
};

/**
 * Confirms the verification code sent to the phone number.
 * @param confirmation - The confirmation result from loginFirebaseWithPhoneNumber.
 * @param code - The verification code received by the user.
 * @returns The authenticated user.
 */
export const confirmVerificationCode = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
) => {
  return await confirmation
    .confirm(code)
    .then(userCredential => {
      console.log('User Credential:', userCredential);
      return userCredential?.user;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      console.error('Error confirming verification code:', error);
      throw error;
    });
};

/**
 * Sends a verification code to the given phone number.
 * @param phoneNumber - The phone number to send the verification code to.
 * @returns A confirmation result to verify the code.
 */
export const verifyPhoneNumber = async (phoneNumber: string) => {
  return await auth()
    .verifyPhoneNumber(phoneNumber)
    .then(confirmation => {
      return confirmation;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      handleFirebaseError(error);
      throw new Error(error.message);
    });
};

/**
 * Confirms the verification code sent to the phone number.
 * @param confirm - The confirm result from verifyPhoneNumber.
 * @param code - The verification code received by the user.
 * @returns The authenticated user.
 */
export const linkPhoneWithExistAccount = async (
  confirm: FirebaseAuthTypes.ConfirmationResult,
  code: string,
) => {
  const credential = auth.PhoneAuthProvider.credential(
    confirm.verificationId,
    code,
  );
  return await auth()
    ?.currentUser?.linkWithCredential(credential)
    .then(userData => {
      return userData?.user;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
        Alert.alert('Something Went Wrong', 'Invalid code.');
      } else {
        handleFirebaseError(error);
        throw new Error(error.message);
      }
    });
};

const handleFirebaseError = (
  error: FirebaseAuthTypes.NativeFirebaseAuthError,
): void => {
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
    default:
      console.log('An unknown error occurred:', error.message);
      Alert.alert('Something Went Wrong', error.message);
  }
};
