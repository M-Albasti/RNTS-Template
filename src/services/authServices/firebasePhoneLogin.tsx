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

//* utils import
import {logger} from '@utils/logger';

export const firebasePhoneLogin = (
  credentials: LoginCredentials,
  loginType: LoginTypes,
): Promise<void> => {
  return loginFirebaseWithPhoneNumber(credentials.emailOrPhone).then(confirmation => {
    logger.debug('Phone confirmation received');
    Alert.alert('Validation Success', 'Your inputs are valid!');
    navigate('FirebasePhoneOTP', {confirmation, loginType});
  });
};
