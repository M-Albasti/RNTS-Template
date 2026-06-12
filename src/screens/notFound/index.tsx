//* packages import
import React from 'react';

//* components import
import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface NotFoundProps {
  navigation: AppStackNavigationProp<'NotFound'>;
}

const NotFound = ({navigation}: NotFoundProps): React.JSX.Element => {
  return (
    <ScreenContainer centered alignContent="center">
      <Heading text="404" level="display" tone="primary" align="center" />
      <Spacer size="sm" />
      <Heading text="Page not found" level="h2" tone="muted" align="center" />
      <Spacer size="md" />
      <TextView
        text="The screen you requested does not exist or was moved."
        variant="body"
        muted
        align="center"
      />
      <Spacer size="xl" />
      <Button
        label="Go back"
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
    </ScreenContainer>
  );
};

export default NotFound;
