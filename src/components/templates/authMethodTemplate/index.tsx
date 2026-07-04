//* packages import
import React from 'react';

//* components import
import AuthMethodButtons from '@organisms/authMethod/AuthMethodsButtons';
import ScreenContainer from '@atoms/ScreenContainer';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AuthMethodTemplateProps {
  navigation: AppStackNavigationProp<'AuthMethod'>;
}

const AuthMethodTemplate = ({
  navigation,
}: AuthMethodTemplateProps): React.JSX.Element => {
  return (
    <ScreenContainer centered scroll alignContent="center">
      <AuthMethodButtons navigation={navigation} />
    </ScreenContainer>
  );
};

export default AuthMethodTemplate;
