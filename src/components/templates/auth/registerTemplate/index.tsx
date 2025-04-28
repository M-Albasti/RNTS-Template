//* packages import
import React from 'react';
import {KeyboardTypeOptions, StyleSheet, View} from 'react-native';

//* components import
import RegisterHeader from '@organisms/auth/register/RegisterHeader';
import RegisterForm from '@organisms/auth/register/RegisterForm';
import RegisterButtons from '@organisms/auth/register/RegisterFooter';

//* types import
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterTemplateProps {
  navigation: AppStackNavigationProp<RegisterScreens>;
  registerType: AppRouteProp<RegisterScreens>;
  keyboardType?: KeyboardTypeOptions;
}

const RegisterTemplate = (props: RegisterTemplateProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <RegisterHeader />
      <RegisterForm
        navigation={props.navigation}
        registerType={props.registerType}
        keyboardType={props.keyboardType}
      />
      <RegisterButtons navigation={props.navigation} />
    </View>
  );
};

export default RegisterTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
