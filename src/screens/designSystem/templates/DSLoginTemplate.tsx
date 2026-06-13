import React from 'react';

import LoginHeader from '@organisms/auth/login/LoginHeader';
import LoginForm from '@organisms/auth/login/LoginForm';
import LoginFooter from '@organisms/auth/login/LoginFooter';
import Spacer from '@atoms/Spacer';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  loginShowcaseNavigation,
  mockRegisterRoute,
} from '../shared/showcaseHelpers';

const LoginTemplateContent = (): React.JSX.Element => (
  <>
    <LoginHeader />
    <Spacer size="lg" />
    <LoginForm
      navigation={loginShowcaseNavigation}
      loginType="Normal"
      keyboardType="email-address"
    />
    <Spacer size="md" />
    <LoginFooter
      navigation={loginShowcaseNavigation}
      register
      registerType={mockRegisterRoute}
    />
  </>
);

export default createShowcaseScreen({
  title: 'Login Template',
  subtitle: 'Inner content without nested ScreenContainer.',
  sections: [{title: 'Full login flow', content: <LoginTemplateContent />}],
});
