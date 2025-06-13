//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import LoginRegisterButton from '@molecules/loginRegisterButton';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {LoginScreens} from '@Types/loginScreens';
import {RegisterScreens} from '@Types/registerScreens';

interface LoginFooterProps {
  navigation: AppStackNavigationProp<LoginScreens>;
  register?: boolean;
  registerType?: AppRouteProp<RegisterScreens>;
}

const LoginFooter = (props: LoginFooterProps): React.JSX.Element => {
  const goToRegister = () => {
    if (props.registerType) {
      props.navigation.navigate(props.registerType.name);
    }
  };

  return (
    <View style={styles.container}>
      {props.register && props.registerType && (
        <LoginRegisterButton goToRegister={goToRegister} />
      )}
    </View>
  );
};

export default LoginFooter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
