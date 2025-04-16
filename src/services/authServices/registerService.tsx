//* packages import
import {Alert} from 'react-native';
import {z} from 'zod';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {registerFirebaseWithEmail} from '@services/firebaseServices/firebaseEmailService';

//* helpers import
import {cleanFirebaseUser} from '@helpers/cleanFirebaseUser';

//* utils import
import registerValidation from '@utils/registerValidation';

//* types import
import {AppDispatch} from '@Types/appDispatch';

//* types import
// import {AppStackNavigationProp} from '@Types/appNavigation';

interface RegisterCredentials {
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
}

export const registerService = async (
  registerType: string,
  credentials: RegisterCredentials,
  //   navigation: AppStackNavigationProp<'Register' | 'FirebaseEmailRegister'>,
  dispatch: AppDispatch,
): Promise<void> => {
  try {
    registerValidation.parse(credentials); // Validate data
    if (registerType === 'firebase') {
      registerFirebaseWithEmail(credentials.emailOrPhone, credentials.password)
        .then(user => {
          // Handle successful register
          dispatch(addUser(cleanFirebaseUser(user)));
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
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};
