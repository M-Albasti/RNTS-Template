import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import LoginHeader from '@organisms/auth/login/LoginHeader';
import LoginForm from '@organisms/auth/login/LoginForm';
import LoginButtons from '@organisms/auth/login/LoginButtons';
import {AppStackNavigationProp} from '@Types/appNavigation';
import loginValidation from '@services/loginValidation';
import {z} from 'zod';

interface LoginTemplateProps {
  navigation: AppStackNavigationProp<'Login'>;
}

const LoginTemplate = (props: LoginTemplateProps) => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = () => {
    const data = {emailOrPhone, password};

    try {
      loginValidation.parse(data); // Validate data
      props.navigation.reset({
        index: 0,
        routes: [{name: 'DrawerRoot'}],
      });
      Alert.alert('Validation Success', 'Your inputs are valid!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message).join('\n');
        Alert.alert('Validation Error', errorMessages);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LoginHeader />
      <LoginForm
        emailOrPhone={emailOrPhone}
        setEmailOrPhone={setEmailOrPhone}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />
      <LoginButtons navigation={props.navigation} onLogin={onLogin} />
    </View>
  );
};

export default LoginTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
