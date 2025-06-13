//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import RegisterLoginButton from '@molecules/registerLoginButton';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterButtonsProps {
  navigation: AppStackNavigationProp<RegisterScreens>;
}

const RegisterButtons = (props: RegisterButtonsProps): React.JSX.Element => {
  const goToLogin = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <RegisterLoginButton goToLogin={goToLogin} />
    </View>
  );
};

export default RegisterButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
