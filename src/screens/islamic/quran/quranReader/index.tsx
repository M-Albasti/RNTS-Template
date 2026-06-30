import React from 'react';
import {ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useQuranSurahQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'QuranReader'>;
  route: AppRouteProp<'QuranReader'>;
};

const QuranReader = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const surahNumber = route.params.surahNumber;
  const {data, isLoading, isError} = useQuranSurahQuery(surahNumber);

  const styles = useThemedStyles(tokens => ({
    arabic: {
      fontSize: tokens.typography.h2.fontSize,
      lineHeight: (tokens.typography.h2.lineHeight ?? 32) * 1.6,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
    },
    ayahWrap: {marginBottom: tokens.spacing.lg},
    badge: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
    },
  }));

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader
        title={data?.name ?? t('islamic.quran.title')}
        onBack={() => navigation.goBack()}
      />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <ScrollView>
          <Card>
            <Heading text={data.englishName} level="h2" />
            <TextView
              text={`${data.englishNameTranslation} · ${data.revelationType}`}
              variant="caption"
              muted
            />
          </Card>
          <Spacer size="md" />
          {data.ayahs.map(ayah => (
            <View key={ayah.number} style={styles.ayahWrap}>
              <View style={styles.badge}>
                <TextView text={String(ayah.numberInSurah)} variant="caption" />
              </View>
              <Spacer size="xs" />
              <TextView text={ayah.text} variant="body" style={styles.arabic} />
            </View>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

export default QuranReader;
