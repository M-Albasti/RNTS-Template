//* packages import
import React from 'react';

//* components import
import AuthMethodTemplate from '@templates/authMethodTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AuthMethodProps {
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethod = (props: AuthMethodProps): React.JSX.Element => {
  return <AuthMethodTemplate navigation={props.navigation} />;
};

export default AuthMethod;
