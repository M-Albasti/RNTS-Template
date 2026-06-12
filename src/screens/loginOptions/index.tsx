import React from 'react';

import LoginOptionsTemplate from '@templates/loginOptionsTemplate';

import type {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginOptionsProps {
  navigation: AppStackNavigationProp<'LoginOptions'>;
}

const LoginOptions = ({navigation}: LoginOptionsProps): React.JSX.Element => {
  return <LoginOptionsTemplate navigation={navigation} />;
};

export default LoginOptions;
