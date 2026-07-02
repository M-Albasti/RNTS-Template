import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {usePrayerTimingsQuery} from '@api/query/hooks/useIslamicQueries';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'PrayerTimes'>};

const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

const PrayerTimes = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {prayerCity, prayerCountry} = useAppSelector(state => state.islamic);
  const {data, isLoading, isError} = usePrayerTimingsQuery(prayerCity, prayerCountry);

  const styles = useThemedStyles(tokens => ({
    row: {
      ...tokens.layout.presets.rowBetween,
      paddingVertical: tokens.spacing.sm,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
    hero: {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
    },
    heroText: {color: tokens.colors.textInverse},
  }));

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('islamic.prayer.title')} onBack={() => navigation.goBack()} />
      <View style={styles.hero}>
        <TextView
          text={`${prayerCity}, ${prayerCountry}`}
          variant="bodySmall"
          style={styles.heroText}
        />
        {data ? (
          <>
            <Spacer size="xs" />
            <Heading text={data.date} level="h3" align="center" />
            <TextView text={data.hijriDate} variant="caption" style={styles.heroText} />
          </>
        ) : null}
      </View>
      <Spacer size="lg" />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <Card>
          {PRAYER_KEYS.map(key => (
            <View key={key} style={styles.row}>
              <TextView text={t(`islamic.prayer.${key}`)} variant="body" />
              <Heading text={data[key]} level="h3" />
            </View>
          ))}
        </Card>
      )}
      <Spacer size="md" />
      <TextView text={t('islamic.prayer.source')} variant="caption" muted />
    </ScreenContainer>
  );
};

export default PrayerTimes;
