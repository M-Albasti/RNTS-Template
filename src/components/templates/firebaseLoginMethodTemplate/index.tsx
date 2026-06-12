import React from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import FirebaseLoginMethodButtons from '@organisms/firebaseLoginMethod/FirebaseLoginMethodsButtons';

import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface FirebaseLoginMethodTemplateProps {
  navigation: AppStackNavigationProp<'FirebaseLoginMethod'>;
}

const FirebaseLoginMethodTemplate = ({
  navigation,
}: FirebaseLoginMethodTemplateProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    wrap: {
      width: '100%' as const,
      maxWidth: 420,
      gap: tokens.spacing.sm,
    },
  }));

  return (
    <ScreenContainer scroll centered alignContent="center">
      <Heading text="Firebase sign-in" level="h1" align="center" />
      <Spacer size="sm" />
      <View style={styles.wrap}>
        <FirebaseLoginMethodButtons navigation={navigation} />
        <Spacer size="md" />
        <Button
          label="Back"
          variant="ghost"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
};

export default FirebaseLoginMethodTemplate;
