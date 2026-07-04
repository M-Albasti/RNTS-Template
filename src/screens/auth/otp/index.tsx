//* packages import
import React from 'react';

//* components import
import MockOtpTemplate from '@templates/auth/mockOtpTemplate';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface OTPProps {
  navigation: AppStackNavigationProp<'OTP'>;
}

const OTP = ({navigation}: OTPProps): React.JSX.Element => {
  return <MockOtpTemplate navigation={navigation} />;
};

export default OTP;
