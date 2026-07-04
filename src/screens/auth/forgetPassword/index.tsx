//* packages import
import React from 'react';

//* components import
import ForgetPasswordTemplate from '@templates/auth/forgetPasswordTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface ForgetPasswordProps {
  navigation: AppStackNavigationProp<'ForgetPassword'>;
}

const ForgetPassword = ({
  navigation,
}: ForgetPasswordProps): React.JSX.Element => {
  return <ForgetPasswordTemplate navigation={navigation} />;
};

export default ForgetPassword;
