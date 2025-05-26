//* packages import
import {Alert} from 'react-native';
import {ZodError} from 'zod';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {registerFirebaseWithEmail} from '@services/firebaseServices/firebaseEmailService';

//* helpers import
import {cleanFirebaseUserResponse} from '@helpers/cleanFirebaseUserResponse';

//* utils import
import registerValidation from '@utils/registerValidation';

//* types import
import {AppDispatch} from '@Types/appDispatch';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterCredentials {
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
}

export const registerService = async (
  registerType: RegisterScreens,
  credentials: RegisterCredentials,
  dispatch: AppDispatch,
): Promise<void> => {
  try {
    registerValidation.parse(credentials); // Validate data
    if (registerType === 'FirebaseEmailRegister') {
      registerFirebaseWithEmail(credentials.emailOrPhone, credentials.password)
        .then(user => {
          // Handle successful register
          dispatch(addUser(cleanFirebaseUserResponse(user, 'FirebaseEmail')));
          Alert.alert('Register Success', 'You have successfully registered!');
        })
        .catch(error => {
          // Handle register failure
          Alert.alert(
            'Register Failed',
            error.message || 'An error occurred during register.',
          );
        });
      Alert.alert('Validation Success', 'Your inputs are valid!');
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};
