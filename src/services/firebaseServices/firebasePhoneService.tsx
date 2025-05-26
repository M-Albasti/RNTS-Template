//* packages import
import {Alert} from 'react-native';
import {
  FirebaseAuthTypes,
  signInWithPhoneNumber,
  verifyPhoneNumber,
  PhoneAuthProvider,
  getAuth,
} from '@react-native-firebase/auth';

//* services import
import {firebaseErrorHandler} from './firebaseErrorHandler';

// Enable force reCAPTCHA flow for testing
// getAuth().settings.forceRecaptchaFlowForTesting = true;
// Disable app verification reCAPTCHA flow for testing
getAuth().settings.appVerificationDisabledForTesting = true;

/**
 * Sends a verification code to the given phone number.
 * @param phoneNumber - The phone number to send the verification code to.
 * @returns A confirmation result to verify the code.
 */
export const loginFirebaseWithPhoneNumber = async (
  phoneNumber: string,
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  return await signInWithPhoneNumber(getAuth(), phoneNumber)
    .then(confirmation => {
      return confirmation;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      firebaseErrorHandler(error);
      throw new Error(error.message);
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
): Promise<FirebaseAuthTypes.User | undefined> => {
  return await confirmation
    .confirm(code)
    .then(userCredential => {
      console.log('User Credential:', userCredential);
      return userCredential?.user;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      firebaseErrorHandler(error);
      throw new Error(error.message);
    });
};

/**
 * Sends a verification code to the given phone number.
 * @param phoneNumber - The phone number to send the verification code to.
 * @returns A confirmation result to verify the code.
 */
export const handleVerifyPhoneNumber = async (
  phoneNumber: string,
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  return await verifyPhoneNumber(getAuth(), phoneNumber, 60000)
    .then(confirmation => {
      return confirmation;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      firebaseErrorHandler(error);
      throw new Error(error.message);
    });
};

/**
 * Confirms the verification code sent to the phone number.
 * @param verificationId - The verificationId result from handleVerifyPhoneNumber.
 * @param code - The verification code received by the user.
 * @returns The authenticated user.
 */
export const linkPhoneWithExistAccount = async (
  verificationId: FirebaseAuthTypes.ConfirmationResult['verificationId'],
  code: string,
): Promise<FirebaseAuthTypes.User | undefined> => {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  return await getAuth()
    ?.currentUser?.linkWithCredential(credential)
    .then(userData => {
      return userData?.user;
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
        Alert.alert('Something Went Wrong', 'Invalid code.');
      } else {
        firebaseErrorHandler(error);
      }
      throw new Error(error.message);
    });
};
