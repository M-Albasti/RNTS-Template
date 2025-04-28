//* packages import
import {Alert} from 'react-native';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import _ from 'lodash';
import z from 'zod';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {
  confirmVerificationCode,
  linkPhoneWithExistAccount,
} from '@services/firebaseServices/firebasePhoneService';

//* helpers import
import {cleanFirebaseUserResponse} from '@helpers/cleanFirebaseUserResponse';

//* types import
import {AppDispatch} from '@Types/appDispatch';

export const confirmPhoneVerificationCode = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
  dispatch: AppDispatch,
): Promise<void> => {
  try {
    confirmVerificationCode(confirmation, code)
      .then(user => {
        console.log('🚀 ~ user:', user);
        if (!!user && !_.isEmpty(user)) {
          dispatch(addUser(cleanFirebaseUserResponse(user)));
          Alert.alert('Login Success', 'You have successfully logged in!');
        }
      })
      .catch(error => {
        // Handle login failure
        Alert.alert(
          'Login Failed',
          error.message || 'An error occurred during login.',
        );
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};

export const verifyLinkPhoneCode = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
  dispatch: AppDispatch,
): Promise<void> => {
  try {
    linkPhoneWithExistAccount(confirmation, code)
      .then(user => {
        if (!!user && !_.isEmpty(user)) {
          dispatch(addUser(cleanFirebaseUserResponse(user)));
          Alert.alert('Login Success', 'You have successfully logged in!');
        }
      })
      .catch(error => {
        // Handle login failure
        Alert.alert(
          'Login Failed',
          error.message || 'An error occurred during login.',
        );
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};
