//* packages import
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

//* components import
import RegisterButton from '@molecules/RegisterButton';
import RegisterLoginButton from '@molecules/RegisterLoginButton';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface RegisterButtonsProps {
  navigation: AppStackNavigationProp<'Register' | 'FirebaseEmailRegister'>;
  registerType: AppRouteProp<'Register' | 'FirebaseEmailRegister'>;
  onRegister: () => void;
}

const RegisterButtons = (props: RegisterButtonsProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <RegisterButton
        onRegister={props.onRegister}
        registerType={props.registerType}
      />
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
