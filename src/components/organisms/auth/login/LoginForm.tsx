//* packages import
import React, {useState} from 'react';
import {KeyboardTypeOptions, View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import Card from '@atoms/Card';
import EmailOrPhoneTextInput from '@molecules/emailOrPhoneTextInput';
import LoginButton from '@molecules/loginButton';
import PasswordTextInput from '@molecules/passwordTextInput';
import Button from '@atoms/Button';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {apiConfig} from '@config/apiConfig';

import {navigate as rootNavigate} from '@services/navigationServices/NavigationService';
import {loginService} from '@services/authServices/loginService';

//* hooks import
import {useAppDispatch} from '@hooks/useAppDispatch';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

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
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens => ({
    container: {
      width: '100%' as const,
      maxWidth: 420,
    },
    inputs: {
      gap: tokens.spacing.sm,
    },
  }));

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
      <Card>
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
        <Spacer size="sm" />
        <Button
          label={t('auth.forgotPassword')}
          variant="ghost"
          fullWidth
          onPress={() => rootNavigate('ForgetPassword', undefined)}
        />
      </Card>
    </View>
  );
};

export default LoginForm;
