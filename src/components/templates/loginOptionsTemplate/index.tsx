import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveLoginOptionsTemplateStyles} from './styles/resolveLoginOptionsTemplateStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface LoginOptionsTemplateProps {
  navigation: AppStackNavigationProp<'LoginOptions'>;
}

const LoginOptionsTemplate = ({
  navigation,
}: LoginOptionsTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveLoginOptionsTemplateStyles);

  return (
    <ScreenContainer scroll alignContent="center" bottomPadding="xxl">
      <View style={styles.hero}>
        <Heading text={t('loginOptions.welcomeTitle')} level="h1" align="center" />
        <Spacer size="sm" />
        <TextView text={t('loginOptions.subtitle')} align="center" muted />
      </View>

      <Spacer size="lg" />
      <Heading text={t('loginOptions.signInOptions')} level="h2" />
      <Spacer size="md" />

      <View style={styles.grid}>
        <FeatureHubCard
          title={t('loginOptions.firebase')}
          subtitle={t('loginOptions.firebaseSubtitle')}
          iconType="MaterialCommunityIcons"
          iconName="firebase"
          onPress={() => navigation.navigate('FirebaseAuthStack')}
        />
        <FeatureHubCard
          title={t('loginOptions.mockLogin')}
          subtitle={t('loginOptions.mockLoginSubtitle')}
          iconType="Ionicons"
          iconName="log-in-outline"
          onPress={() => navigation.navigate('Login')}
        />
        <FeatureHubCard
          title={t('Register')}
          subtitle={t('loginOptions.registerSubtitle')}
          iconType="Ionicons"
          iconName="person-add-outline"
          onPress={() => navigation.navigate('Register')}
        />
        <FeatureHubCard
          title={t('loginOptions.forgotPasswordTitle')}
          subtitle={t('loginOptions.forgotPasswordSubtitle')}
          iconType="Ionicons"
          iconName="key-outline"
          onPress={() => navigation.navigate('ForgetPassword')}
        />
      </View>

      <Spacer size="lg" />
      <Card constrained>
        <View style={styles.footer}>
          <TextView text={t('loginOptions.jumpHint')} variant="bodySmall" muted />
          <Spacer size="sm" />
          <Button
            label={t('loginOptions.classicAuthMenu')}
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
