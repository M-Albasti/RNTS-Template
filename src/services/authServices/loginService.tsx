//* packages import
import {Dispatch} from 'redux';
import {Alert} from 'react-native';
import {z} from 'zod';
import _ from 'lodash';

//* redux import
import {addUser} from '@redux/slices/authSlice';

//* services import
import {loginFirebaseWithEmail} from '@services/firebaseServices/firebaseEmailService';
import {
  confirmVerificationCode,
  loginFirebaseWithPhoneNumber,
} from '@services/firebaseServices/firebasePhoneService';

//* helpers import
import {cleanFirebaseUserResponse} from '@helpers/cleanFirebaseUserResponse';

//* utils import
import loginValidation from '@utils/loginValidation';

//* types import
import {LoginTypes} from '@Types/loginTypes';
import {AppStackNavigationProp} from '@Types/appNavigation';
import {LoginScreens} from '@Types/loginScreens';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export const loginService = async (
  loginType: LoginTypes,
  credentials: LoginCredentials,
  dispatch: Dispatch,
  navigation?: AppStackNavigationProp<LoginScreens>,
): Promise<void> => {
  try {
    loginValidation.parse(credentials); // Validate data
    if (loginType === 'FirebaseEmail') {
      loginFirebaseWithEmail(credentials.emailOrPhone, credentials.password)
        .then(user => {
          // Handle successful login
          dispatch(addUser(cleanFirebaseUserResponse(user)));
          Alert.alert('Login Success', 'You have successfully logged in!');
        })
        .catch(error => {
          // Handle login failure
          Alert.alert(
            'Login Failed',
            error.message || 'An error occurred during login.',
          );
        });
      Alert.alert('Validation Success', 'Your inputs are valid!');
    } else if (loginType === 'FirebasePhone') {
      loginFirebaseWithPhoneNumber(credentials.emailOrPhone).then(
        confirmation => {
          // Handle successful login
          console.log('🚀 ~ confirmation:', confirmation);
          navigation?.navigate('FirebasePhoneOTP', {confirmation});
          return confirmation;
        },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('\n');
      Alert.alert('Validation Error', errorMessages);
    }
  }
};
