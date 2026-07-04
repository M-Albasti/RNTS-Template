//* packages import
import {Alert} from 'react-native';

//* redux import
import {addUser, logout} from '@redux/slices/authSlice';

//* api import
import {authClient} from '@api/clients/authClient';
import {mapLoginResponseToUser} from '@api/mappers/auth.mapper';
import {queryClient} from '@api/query/queryClient';
import {queryKeys} from '@api/query/queryKeys';

//* config import
import type {ApiError} from '@config/network/apiError';
import {clearAccessToken, setAccessToken} from '@config/network/tokenStorage';

//* translation import
import i18n from '@translation/i18n';

//* firebase import
import {
  trackLoginFailure,
  trackLoginSuccess,
  trackRegisterFailure,
  trackRegisterSuccess,
} from '@services/firebaseServices/firebaseAuthAnalytics';

//* types import
import {AppDispatch} from '@Types/appDispatch';
import {LoginTypes} from '@Types/loginTypes';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

const clearSession = (dispatch: AppDispatch): void => {
  clearAccessToken();
  dispatch(logout());
  queryClient.clear();
};

export const apiLoginService = async (
  credentials: LoginCredentials,
  dispatch: AppDispatch,
  loginType: LoginTypes,
): Promise<void> => {
  try {
    const response = await authClient.login({
      email: credentials.emailOrPhone,
      password: credentials.password,
    });
    setAccessToken(response.token);
    dispatch(addUser(mapLoginResponseToUser(response, loginType)));
    queryClient.invalidateQueries({queryKey: queryKeys.dashboard()});
    queryClient.invalidateQueries({queryKey: queryKeys.all});
    await trackLoginSuccess(loginType);
    Alert.alert(i18n.t('auth.loginSuccess'), i18n.t('auth.loginSuccessMessage'));
  } catch (error) {
    const apiError = error as ApiError;
    await trackLoginFailure(loginType, apiError.message || i18n.t('auth.invalidCredentials'));
    Alert.alert(
      i18n.t('auth.loginFailed'),
      apiError.message || i18n.t('auth.invalidCredentials'),
    );
  }
};

export const apiRegisterService = async (
  credentials: LoginCredentials & {confirmPassword: string},
  dispatch: AppDispatch,
): Promise<void> => {
  try {
    const response = await authClient.register({
      email: credentials.emailOrPhone,
      password: credentials.password,
      name: credentials.emailOrPhone.split('@')[0],
    });
    setAccessToken(response.token);
    dispatch(addUser(mapLoginResponseToUser(response, 'Normal')));
    queryClient.invalidateQueries({queryKey: queryKeys.dashboard()});
    await trackRegisterSuccess('Normal');
    Alert.alert(i18n.t('auth.registerSuccess'), i18n.t('auth.registerSuccessMessage'));
  } catch (error) {
    const apiError = error as ApiError;
    await trackRegisterFailure(
      'Normal',
      apiError.message || i18n.t('auth.registrationFailed'),
    );
    Alert.alert(
      i18n.t('auth.registerFailed'),
      apiError.message || i18n.t('auth.registrationFailed'),
    );
  }
};

export const apiLogoutService = (dispatch: AppDispatch): void => {
  clearSession(dispatch);
  Alert.alert(i18n.t('auth.logoutSuccess'), i18n.t('auth.logoutSuccessMessage'));
};
