import React from 'react';
import {View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useThemedStyles} from '@theme/createThemedStyles';

const LoginOptionsContent = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      alignItems: 'center' as const,
    },
    grid: {
      flexDirection: tokens.layout.flexDirection.row,
      flexWrap: tokens.layout.flexWrap.wrap,
      gap: tokens.spacing.sm,
      width: '100%' as const,
    },
    footer: {width: '100%' as const, maxWidth: 400, gap: tokens.spacing.sm},
  }));

  return (
    <>
      <View style={styles.hero}>
        <Heading text="Welcome" level="h1" align="center" />
        <Spacer size="sm" />
        <TextView text="Choose how you want to sign in." align="center" muted />
      </View>
      <Spacer size="lg" />
      <Heading text="Sign-in options" level="h2" />
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title="Firebase"
          subtitle="Social & email auth"
          iconType="MaterialCommunityIcons"
          iconName="firebase"
          onPress={() => {}}
        />
        <FeatureHubCard
          title="Mock login"
          subtitle="Dev credentials"
          iconType="Ionicons"
          iconName="log-in-outline"
          onPress={() => {}}
        />
        <FeatureHubCard
          title="Register"
          subtitle="Create account"
          iconType="Ionicons"
          iconName="person-add-outline"
          onPress={() => {}}
        />
        <FeatureHubCard
          title="Forgot password"
          subtitle="Reset flow"
          iconType="Ionicons"
          iconName="key-outline"
          onPress={() => {}}
        />
      </View>
      <Spacer size="lg" />
      <Card constrained>
        <View style={styles.footer}>
          <TextView text="Jump to classic auth menu." variant="bodySmall" muted />
          <Spacer size="sm" />
          <Button label="Classic auth menu" variant="outline" fullWidth onPress={() => {}} />
        </View>
      </Card>
    </>
  );
};

export default createShowcaseScreen({
  title: 'Login Options Template',
  sections: [{title: 'Hub cards layout', content: <LoginOptionsContent />}],
});
