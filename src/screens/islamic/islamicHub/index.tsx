import React from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import ApiErrorView from '@atoms/ApiErrorView';
import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'IslamicHub'>};

const IslamicHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors, sizes} = useThemeTokens();
  const lastRead = useAppSelector(state => state.islamic.lastRead);

  const styles = useThemedStyles(tokens => ({
    hero: {
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      overflow: 'hidden' as const,
    },
    heroGlow: {
      position: 'absolute' as const,
      top: -40,
      right: -20,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: tokens.colors.primaryMuted,
    },
    heroText: {color: tokens.colors.textMuted},
    heroTitle: {color: tokens.colors.textPrimary},
    continueCard: {
      marginTop: tokens.spacing.md,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    card: {
      flex: tokens.layout.flex.fill,
      minWidth: '46%' as const,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      minHeight: 120,
      ...tokens.shadows.sm,
    },
    cardPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: tokens.radius.md,
      backgroundColor: tokens.colors.primaryMuted,
      ...tokens.layout.presets.center,
      marginBottom: tokens.spacing.sm,
    },
  }));

  const modules = [
    {
      title: t('islamic.modules.quran.title'),
      subtitle: t('islamic.modules.quran.subtitle'),
      route: 'QuranHub' as const,
      icon: 'book-outline',
    },
    {
      title: t('islamic.search.title'),
      subtitle: t('islamic.search.hubSubtitle'),
      route: 'IslamicUnifiedSearch' as const,
      icon: 'search-outline',
    },
    {
      title: t('islamic.modules.adhkar.title'),
      subtitle: t('islamic.modules.adhkar.subtitle'),
      route: 'AdhkarCategories' as const,
      icon: 'heart-outline',
    },
    {
      title: t('islamic.modules.hadith.title'),
      subtitle: t('islamic.modules.hadith.subtitle'),
      route: 'HadithHub' as const,
      icon: 'library-outline',
    },
    {
      title: t('islamic.modules.prayer.title'),
      subtitle: t('islamic.modules.prayer.subtitle'),
      route: 'PrayerTimes' as const,
      icon: 'time-outline',
    },
    {
      title: t('islamic.modules.settings.title'),
      subtitle: t('islamic.modules.settings.subtitle'),
      route: 'IslamicSettings' as const,
      icon: 'notifications-outline',
    },
  ];

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('islamic.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'search',
            iconName: 'search-outline',
            onPress: () => navigation.navigate('IslamicUnifiedSearch'),
            accessibilityLabel: t('islamic.search.title'),
          },
          {
            key: 'settings',
            iconName: 'settings-outline',
            onPress: () => navigation.navigate('IslamicSettings'),
            accessibilityLabel: t('islamic.settings.title'),
          },
        ]}
      />
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <TextView text={t('islamic.hubSubtitle')} variant="bodySmall" style={styles.heroText} />
        <Spacer size="xs" />
        <Heading text={t('islamic.hubTitle')} level="h1" style={styles.heroTitle} />
        <Pressable
          style={styles.continueCard}
          onPress={() =>
            navigation.navigate('QuranReader', {
              surahNumber: lastRead.surahNumber,
              ayahNumber: lastRead.ayahNumber,
            })
          }>
          <TextView text={t('islamic.quran.continueReading')} variant="caption" style={styles.heroText} />
          <Heading
            text={t('islamic.quran.continueReadingRef', {
              surah: lastRead.surahNumber,
              ayah: lastRead.ayahNumber,
            })}
            level="h3"
            style={styles.heroTitle}
          />
        </Pressable>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        {modules.map(module => (
          <Pressable
            key={module.route}
            style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate(module.route)}>
            <View style={styles.iconWrap}>
              <IconView
                iconType="Ionicons"
                name={module.icon}
                size={sizes.iconSm}
                color={colors.primary}
              />
            </View>
            <Heading text={module.title} level="h3" />
            <Spacer size="xs" />
            <TextView text={module.subtitle} variant="caption" muted />
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
};

export const IslamicLoadingState = (): React.JSX.Element => (
  <View style={{padding: 24, alignItems: 'center'}}>
    <ActivityIndicator />
  </View>
);

export const IslamicErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}): React.JSX.Element => (
  <ApiErrorView message={message} onRetry={onRetry} compact />
);

export default IslamicHub;
