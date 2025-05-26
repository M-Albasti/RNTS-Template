//* packages import
import {Alert} from 'react-native';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {isEmpty} from 'lodash';

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
import {LoginTypes} from '@Types/loginTypes';

export const confirmPhoneVerificationCode = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
  dispatch: AppDispatch,
  loginType: LoginTypes,
): Promise<void> => {
  confirmVerificationCode(confirmation, code)
    .then(user => {
      console.log('User: =>', user);
      if (!!user && !isEmpty(user)) {
        dispatch(addUser(cleanFirebaseUserResponse(user, loginType)));
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
};

export const verifyLinkPhoneCode = async (
  verificationId: FirebaseAuthTypes.ConfirmationResult['verificationId'],
  code: string,
  dispatch: AppDispatch,
  loginType: LoginTypes,
): Promise<void> => {
  linkPhoneWithExistAccount(verificationId, code)
    .then(user => {
      if (!!user && !isEmpty(user)) {
        dispatch(addUser(cleanFirebaseUserResponse(user, loginType)));
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
};
