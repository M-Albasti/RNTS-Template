//* packages import
import {Alert} from 'react-native';

//* services import
import {loginFirebaseWithPhoneNumber} from '@services/firebaseServices/firebasePhoneService';
import {navigate} from '@services/navigationServices/NavigationService';

//* types import
import {LoginTypes} from '@Types/loginTypes';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export const firebasePhoneLogin = (
  credentials: LoginCredentials,
  loginType: LoginTypes,
) => {
  loginFirebaseWithPhoneNumber(credentials.emailOrPhone).then(confirmation => {
    // Handle successful login
    console.log('Confirmation:', confirmation);
    Alert.alert('Validation Success', 'Your inputs are valid!');
    navigate('FirebasePhoneOTP', {confirmation, loginType});
  });
};
