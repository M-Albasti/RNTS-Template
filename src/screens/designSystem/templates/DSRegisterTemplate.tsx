import React from 'react';

import RegisterHeader from '@organisms/auth/register/RegisterHeader';
import RegisterForm from '@organisms/auth/register/RegisterForm';
import RegisterFooter from '@organisms/auth/register/RegisterFooter';
import Spacer from '@atoms/Spacer';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {
  mockRegisterRoute,
  registerShowcaseNavigation,
} from '../shared/showcaseHelpers';

const RegisterTemplateContent = (): React.JSX.Element => (
  <>
    <RegisterHeader />
    <Spacer size="lg" />
    <RegisterForm
      navigation={registerShowcaseNavigation}
      registerType={mockRegisterRoute}
      keyboardType="email-address"
    />
    <Spacer size="md" />
    <RegisterFooter navigation={registerShowcaseNavigation} />
  </>
);

export default createShowcaseScreen({
  title: 'Register Template',
  sections: [{title: 'Full register flow', content: <RegisterTemplateContent />}],
});
