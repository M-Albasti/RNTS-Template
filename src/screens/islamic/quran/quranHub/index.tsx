import React from 'react';
import {Pressable, View} from 'react-native';
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

type Props = {navigation: AppStackNavigationProp<'QuranHub'>};

const QuranHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const lastRead = useAppSelector(state => state.islamic.lastRead);

  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
    },
    heroText: {color: tokens.colors.textInverse},
    continueCard: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    continuePressed: {backgroundColor: tokens.colors.surfaceSecondary},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('islamic.quran.title')} onBack={() => navigation.goBack()} />
      <View style={styles.hero}>
        <TextView
          text={t('islamic.quran.hubSubtitle')}
          variant="bodySmall"
          style={styles.heroText}
        />
        <Spacer size="xs" />
        <Heading text={t('islamic.quran.hubTitle')} level="h2" align="center" />
      </View>
      <Spacer size="md" />
      <Pressable
        style={({pressed}) => [styles.continueCard, pressed && styles.continuePressed]}
        onPress={() =>
          navigation.navigate('QuranReader', {
            surahNumber: lastRead.surahNumber,
            ayahNumber: lastRead.ayahNumber,
          })
        }>
        <Heading text={t('islamic.quran.continueReading')} level="h3" />
        <Spacer size="xs" />
        <TextView
          text={t('islamic.quran.continueReadingRef', {
            surah: lastRead.surahNumber,
            ayah: lastRead.ayahNumber,
          })}
          variant="caption"
          muted
        />
      </Pressable>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('islamic.quran.index')}
          subtitle={t('islamic.quran.indexSubtitle')}
          iconType="Ionicons"
          iconName="list-outline"
          onPress={() => navigation.navigate('QuranIndex')}
        />
        <FeatureHubCard
          title={t('islamic.quran.search')}
          subtitle={t('islamic.quran.searchModesSubtitle')}
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('IslamicUnifiedSearch')}
        />
        <FeatureHubCard
          title={t('islamic.quran.allSurahs')}
          subtitle={t('islamic.quran.allSurahsSubtitle')}
          iconType="Ionicons"
          iconName="book-outline"
          onPress={() => navigation.navigate('QuranList')}
        />
      </View>
    </ScreenContainer>
  );
};

export default QuranHub;
