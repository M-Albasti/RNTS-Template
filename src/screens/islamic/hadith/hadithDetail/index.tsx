import React from 'react';
import {ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useHadithDetailQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'HadithDetail'>;
  route: AppRouteProp<'HadithDetail'>;
};

const HadithDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {hadithId, title} = route.params;
  const {data, isLoading, isError} = useHadithDetailQuery(hadithId, language);

  const styles = useThemedStyles(tokens => ({
    grade: {
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
    },
  }));

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <ScrollView>
          <Card>
            <Heading text={`#${data.hadithIndex}`} level="h2" />
            {data.bookName ? (
              <>
                <Spacer size="xs" />
                <TextView text={data.bookName} variant="caption" muted />
              </>
            ) : null}
            <Spacer size="md" />
            <TextView text={data.text} variant="body" />
          </Card>
          <Spacer size="md" />
          {data.grades.length > 0 ? (
            <>
              <Heading text={t('islamic.hadith.grades')} level="h3" />
              <Spacer size="sm" />
              {data.grades.map(grade => (
                <View key={`${grade.name}-${grade.grade}`} style={styles.grade}>
                  <TextView text={`${grade.name}: ${grade.grade}`} variant="bodySmall" />
                </View>
              ))}
            </>
          ) : null}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

export default HadithDetail;
