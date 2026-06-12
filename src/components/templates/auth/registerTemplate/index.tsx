import React from 'react';
import {KeyboardTypeOptions, View} from 'react-native';

import ScreenContainer from '@atoms/ScreenContainer';import Spacer from '@atoms/Spacer';
import RegisterHeader from '@organisms/auth/register/RegisterHeader';
import RegisterForm from '@organisms/auth/register/RegisterForm';
import RegisterFooter from '@organisms/auth/register/RegisterFooter';

import {useThemedStyles} from '@theme/createThemedStyles';
import {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import {RegisterScreens} from '@Types/registerScreens';

interface RegisterTemplateProps {
  navigation: AppStackNavigationProp<RegisterScreens>;
  registerType: AppRouteProp<RegisterScreens>;
  keyboardType?: KeyboardTypeOptions;
}

const RegisterTemplate = (props: RegisterTemplateProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    formWrap: {
      width: '100%' as const,
      maxWidth: 420,
    },
  }));

  return (
    <ScreenContainer scroll centered scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <RegisterHeader />
      <Spacer size="lg" />
      <View style={styles.formWrap}>
        <RegisterForm
          navigation={props.navigation}
          registerType={props.registerType}
          keyboardType={props.keyboardType}
        />
      </View>
      <Spacer size="md" />
      <RegisterFooter navigation={props.navigation} />
    </ScreenContainer>
  );
};

export default RegisterTemplate;
