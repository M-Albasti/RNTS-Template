import React from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'IslamicHub'>};

const IslamicHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
    },
    heroText: {color: tokens.colors.textInverse},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    card: {
      flex: tokens.layout.flex.fill,
      minWidth: '46%' as const,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    cardPressed: {backgroundColor: tokens.colors.surfaceSecondary},
  }));

  const modules = [
    {
      title: t('islamic.modules.quran.title'),
      subtitle: t('islamic.modules.quran.subtitle'),
      route: 'QuranHub' as const,
    },
    {
      title: t('islamic.search.title'),
      subtitle: t('islamic.search.hubSubtitle'),
      route: 'IslamicUnifiedSearch' as const,
    },
    {
      title: t('islamic.modules.adhkar.title'),
      subtitle: t('islamic.modules.adhkar.subtitle'),
      route: 'AdhkarCategories' as const,
    },
    {
      title: t('islamic.modules.hadith.title'),
      subtitle: t('islamic.modules.hadith.subtitle'),
      route: 'HadithHub' as const,
    },
    {
      title: t('islamic.modules.prayer.title'),
      subtitle: t('islamic.modules.prayer.subtitle'),
      route: 'PrayerTimes' as const,
    },
    {
      title: t('islamic.modules.settings.title'),
      subtitle: t('islamic.modules.settings.subtitle'),
      route: 'IslamicSettings' as const,
    },
  ];

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('islamic.title')} showBack={false} />
      <View style={styles.hero}>
        <TextView
          text={t('islamic.hubSubtitle')}
          variant="bodySmall"
          style={styles.heroText}
        />
        <Spacer size="xs" />
        <Heading text={t('islamic.hubTitle')} level="h2" align="center" />
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        {modules.map(module => (
          <Pressable
            key={module.route}
            style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate(module.route)}>
            <Heading text={module.title} level="h3" />
            <Spacer size="xs" />
            <TextView text={module.subtitle} variant="caption" muted />
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
};

export default IslamicHub;

export const IslamicLoadingState = (): React.JSX.Element => {
  const styles = useThemedStyles(tokens => ({
    wrap: {...tokens.layout.presets.center, padding: tokens.spacing.xl},
  }));

  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export const IslamicErrorState = ({message}: {message: string}): React.JSX.Element => (
  <Card>
    <TextView text={message} variant="body" muted />
  </Card>
);
