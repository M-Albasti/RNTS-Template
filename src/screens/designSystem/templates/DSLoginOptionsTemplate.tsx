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
import {resolveDSLoginOptionsTemplateStyles} from './styles/resolveDSLoginOptionsTemplateStyles';

const LoginOptionsContent = (): React.JSX.Element => {
  const styles = useThemedStyles(resolveDSLoginOptionsTemplateStyles);

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
