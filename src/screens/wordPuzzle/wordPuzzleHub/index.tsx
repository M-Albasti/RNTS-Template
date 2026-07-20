import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'WordPuzzleHub'>};

/** Quizzo-inspired word puzzle hub: gamey gem badge + world cards. */
const WordPuzzleHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const gems = useAppSelector(state => state.wordPuzzle.gems);

  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      gap: tokens.spacing.sm,
      alignItems: 'center' as const,
    },
    gemBadge: {
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('wordPuzzle.title')} showBack={false} showDrawer navigation={navigation} />
      <View style={styles.hero}>
        <Heading text={t('wordPuzzle.hubTitle')} level="h2" align="center" />
        <TextView
          text={t('wordPuzzle.hubSubtitle')}
          variant="bodySmall"
          muted
          align="center"
        />
        <View style={styles.gemBadge}>
          <TextView text={t('wordPuzzle.gems', {count: gems})} />
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('wordPuzzle.arabicWorld')}
          subtitle={t('wordPuzzle.arabicWorldSubtitle')}
          iconType="Ionicons"
          iconName="book-outline"
          onPress={() => navigation.navigate('WordPuzzleLibrary', {language: 'ar'})}
        />
        <FeatureHubCard
          title={t('wordPuzzle.englishWorld')}
          subtitle={t('wordPuzzle.englishWorldSubtitle')}
          iconType="Ionicons"
          iconName="book-outline"
          onPress={() => navigation.navigate('WordPuzzleLibrary', {language: 'en'})}
        />
      </View>
    </ScreenContainer>
  );
};

export default WordPuzzleHub;
