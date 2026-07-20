//* packages import
import React, {useState} from 'react';
import {KeyboardTypeOptions, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';
import LoginButton from '@molecules/loginButton';
import PasswordTextInput from '@molecules/passwordTextInput';
import IconView from '@atoms/Icon';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {apiConfig} from '@config/apiConfig';

import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';
import {loginService} from '@services/authServices/loginService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveLoginFormStyles} from './styles/resolveLoginFormStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {LoginScreens} from '@Types/loginScreens';
import {LoginTypes} from '@Types/loginTypes';

interface LoginFormProps {
  navigation: AppStackNavigationProp<LoginScreens>;
  loginType: LoginTypes;
  keyboardType?: KeyboardTypeOptions;
}

const LoginForm = (props: LoginFormProps): React.JSX.Element => {
  const {t} = useTranslation();
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(resolveLoginFormStyles);

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const onLogin = async () => {
    setLoading(true);
    try {
      await loginService(props.loginType, dispatch, {emailOrPhone, password});
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <EmailOrPhoneTextInput
          emailOrPhone={emailOrPhone}
          setEmailOrPhone={setEmailOrPhone}
          keyboardType={props.keyboardType}
        />
        <PasswordTextInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
        />
      </View>

      <View style={styles.optionsRow}>
        <Pressable
          style={styles.rememberRow}
          onPress={() => setRememberMe(prev => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{checked: rememberMe}}>
          <View
            style={[
              styles.checkbox,
              rememberMe && {backgroundColor: colors.primary, borderColor: colors.primary},
            ]}>
            {rememberMe ? (
              <IconView
                iconType="Ionicons"
                name="checkmark"
                size={14}
                color={colors.textInverse}
              />
            ) : null}
          </View>
          <TextView text={t('auth.rememberMe')} variant="bodySmall" />
        </Pressable>
        <Pressable onPress={() => rootNavigate('ForgetPassword', undefined)}>
          <TextView
            text={t('auth.forgotPassword')}
            variant="bodySmall"
            style={styles.forgotLink}
          />
        </Pressable>
      </View>

      <Spacer size="md" />
      <LoginButton onLogin={onLogin} loading={loading} />
      {props.loginType === 'Normal' && apiConfig.useMocks ? (
        <>
          <Spacer size="sm" />
          <TextView
            text={t('auth.mockLoginHint')}
            variant="caption"
            muted
            align="center"
          />
        </>
      ) : null}
    </View>
  );
};

export default LoginForm;
