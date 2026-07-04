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

const WordPuzzleHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const gems = useAppSelector(state => state.wordPuzzle.gems);

  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: '#6abf69',
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
    },
    heroText: {color: tokens.colors.textInverse},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    gemRow: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('wordPuzzle.title')} showBack={false} />
      <View style={styles.hero}>
        <Heading text={t('wordPuzzle.hubTitle')} level="h2" align="center" style={styles.heroText} />
        <Spacer size="xs" />
        <TextView text={t('wordPuzzle.hubSubtitle')} variant="bodySmall" style={styles.heroText} align="center" />
        <Spacer size="md" />
        <View style={styles.gemRow}>
          <TextView text={t('wordPuzzle.gems', {count: gems})} style={styles.heroText} />
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('wordPuzzle.arabicWorld')}
          subtitle={t('wordPuzzle.arabicWorldSubtitle')}
          iconType="Ionicons"
          iconName="book-outline"
          accentColor="#d4efdf"
          onPress={() => navigation.navigate('WordPuzzleLibrary', {language: 'ar'})}
        />
        <FeatureHubCard
          title={t('wordPuzzle.englishWorld')}
          subtitle={t('wordPuzzle.englishWorldSubtitle')}
          iconType="Ionicons"
          iconName="book-outline"
          accentColor="#d6eaf8"
          onPress={() => navigation.navigate('WordPuzzleLibrary', {language: 'en'})}
        />
      </View>
    </ScreenContainer>
  );
};

export default WordPuzzleHub;
