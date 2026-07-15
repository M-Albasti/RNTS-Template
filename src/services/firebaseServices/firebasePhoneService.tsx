//* packages import
import {Alert} from 'react-native';
import {
  getAuth,
  linkWithCredential,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  verifyPhoneNumber,
  type ConfirmationResult,
  type NativeFirebaseAuthError,
  type User,
} from '@react-native-firebase/auth';

//* services import
import {firebaseErrorHandler} from '@services/firebaseServices/firebaseErrorHandler';

declare global {
  // Set to true in Jest/E2E runs only — never in ordinary debug builds.
  var __RNTS_PHONE_AUTH_TEST__: boolean | undefined;
}

let phoneAuthTestingConfigured = false;

const configurePhoneAuthForTesting = (): void => {
  if (phoneAuthTestingConfigured || !globalThis.__RNTS_PHONE_AUTH_TEST__) {
    return;
  }

  getAuth().settings.appVerificationDisabledForTesting = true;
  phoneAuthTestingConfigured = true;
};

/**
 * Sends a verification code to the given phone number.
 * @param phoneNumber - The phone number to send the verification code to.
 * @returns A confirmation result to verify the code.
 */
export const loginFirebaseWithPhoneNumber = async (
  phoneNumber: string,
): Promise<ConfirmationResult> => {
  configurePhoneAuthForTesting();
  return await signInWithPhoneNumber(getAuth(), phoneNumber)
    .then(confirmation => {
      return confirmation;
    })
    .catch((error: NativeFirebaseAuthError) => {
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
  confirmation: ConfirmationResult,
  code: string,
): Promise<User | undefined> => {
  return await confirmation
    .confirm(code)
    .then(userCredential => {
      console.log('User Credential:', userCredential);
      return userCredential?.user;
    })
    .catch((error: NativeFirebaseAuthError) => {
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
): Promise<ConfirmationResult> => {
  configurePhoneAuthForTesting();
  return await verifyPhoneNumber(getAuth(), phoneNumber, 60000)
    .then(confirmation => {
      return confirmation;
    })
    .catch((error: NativeFirebaseAuthError) => {
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
  verificationId: ConfirmationResult['verificationId'],
  code: string,
): Promise<User | undefined> => {
  const currentUser = getAuth().currentUser;
  if (!verificationId || !currentUser) {
    throw new Error('Missing verification ID or signed-in user.');
  }

  const credential = PhoneAuthProvider.credential(verificationId, code);
  return await linkWithCredential(currentUser, credential)
    .then(userData => {
      return userData?.user;
    })
    .catch((error: NativeFirebaseAuthError) => {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
        Alert.alert('Something Went Wrong', 'Invalid code.');
      } else {
        firebaseErrorHandler(error);
      }
      throw new Error(error.message);
    });
};
