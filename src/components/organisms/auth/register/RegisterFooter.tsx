//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

//* components import
import RegisterLoginButton from '@molecules/RegisterLoginButton';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterButtonsProps {
  navigation: AppStackNavigationProp<RegisterScreens>;
}

const RegisterButtons = (props: RegisterButtonsProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <RegisterLoginButton navigation={props.navigation} />
    </View>
  );
};

export default RegisterButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
