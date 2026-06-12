import React from 'react';
import {StyleSheet, View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginOptionsTemplateProps {
  navigation: AppStackNavigationProp<'LoginOptions'>;
}

const LoginOptionsTemplate = ({
  navigation,
}: LoginOptionsTemplateProps): React.JSX.Element => {
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        backgroundColor: tokens.colors.primaryMuted,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        alignItems: 'center',
      },
      grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: tokens.spacing.sm,
        width: '100%',
      },
      footer: {
        width: '100%',
        maxWidth: 400,
        gap: tokens.spacing.sm,
      },
    }),
  );

  return (
    <ScreenContainer scroll alignContent="center" bottomPadding="xxl">
      <View style={styles.hero}>
        <Heading text="Welcome to RNTS" level="h1" align="center" />
        <Spacer size="sm" />
        <TextView
          text="Pick how you want to sign in and start exploring the app hub."
          align="center"
          muted
        />
      </View>

      <Spacer size="lg" />
      <Heading text="Sign in options" level="h2" />
      <Spacer size="md" />

      <View style={styles.grid}>
        <FeatureHubCard
          title="Firebase"
          subtitle="Google, Apple, email & phone"
          iconType="MaterialCommunityIcons"
          iconName="firebase"
          onPress={() => navigation.navigate('FirebaseAuthStack')}
        />
        <FeatureHubCard
          title="Mock login"
          subtitle="Email/password demo API"
          iconType="Ionicons"
          iconName="log-in-outline"
          onPress={() => navigation.navigate('Login')}
        />
        <FeatureHubCard
          title="Register"
          subtitle="Create a mock account"
          iconType="Ionicons"
          iconName="person-add-outline"
          onPress={() => navigation.navigate('Register')}
        />
        <FeatureHubCard
          title="Forgot password"
          subtitle="Reset via mock OTP flow"
          iconType="Ionicons"
          iconName="key-outline"
          onPress={() => navigation.navigate('ForgetPassword')}
        />
      </View>

      <Spacer size="lg" />
      <Card constrained>
        <View style={styles.footer}>
          <TextView
            text="Already know your path? Jump straight to the classic auth screen."
            variant="bodySmall"
            muted
          />
          <Spacer size="sm" />
          <Button
            label="Classic auth menu"
            variant="outline"
            fullWidth
            onPress={() => navigation.navigate('AuthMethod')}
          />
        </View>
      </Card>
    </ScreenContainer>
  );
};

export default LoginOptionsTemplate;
