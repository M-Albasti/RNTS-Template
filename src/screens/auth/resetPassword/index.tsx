//* packages import
import React from 'react';

//* components import
import ResetPasswordTemplate from '@templates/auth/resetPasswordTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface ResetPasswordProps {
  navigation: AppStackNavigationProp<'ResetPassword'>;
}

const ResetPassword = ({
  navigation,
}: ResetPasswordProps): React.JSX.Element => {
  return <ResetPasswordTemplate navigation={navigation} />;
};

export default ResetPassword;
