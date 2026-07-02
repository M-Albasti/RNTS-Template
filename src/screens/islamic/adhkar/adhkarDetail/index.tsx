import React from 'react';
import {ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAdhkarCategoryQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'AdhkarDetail'>;
  route: AppRouteProp<'AdhkarDetail'>;
};

const AdhkarDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {categoryId, title} = route.params;
  const {data, isLoading, isError} = useAdhkarCategoryQuery(categoryId, lang);

  const styles = useThemedStyles(tokens => ({
    arabic: {
      fontSize: tokens.typography.h3.fontSize,
      lineHeight: (tokens.typography.h3.lineHeight ?? 28) * 1.5,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
    },
    repeat: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
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
          <TextView
            text={t('islamic.adhkar.source')}
            variant="caption"
            muted
          />
          <Spacer size="md" />
          {data.items.map(item => (
            <View key={item.id}>
              <Card>
                <View style={styles.repeat}>
                  <TextView
                    text={t('islamic.adhkar.repeat', {count: item.repeat})}
                    variant="caption"
                  />
                </View>
                <TextView text={item.arabicText} variant="body" style={styles.arabic} />
                {item.translatedText ? (
                  <>
                    <Spacer size="sm" />
                    <TextView text={item.translatedText} variant="bodySmall" muted />
                  </>
                ) : null}
              </Card>
              <Spacer size="md" />
            </View>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

export default AdhkarDetail;
