import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View} from 'react-native';
import {FlashList, type FlashListRef} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAdhkarCategoryQuery} from '@api/query/hooks/useIslamicQueries';
import {resolveArabicBodyTextStyle} from '@theme/arabicText';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {AdhkarItem} from '@Types/islamicTypes';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'AdhkarDetail'>;
  route: AppRouteProp<'AdhkarDetail'>;
};

const AdhkarDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {categoryId, title, itemId} = route.params;
  const {data, isLoading, isError} = useAdhkarCategoryQuery(categoryId, lang);
  const listRef = useRef<FlashListRef<AdhkarItem>>(null);

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    arabic: resolveArabicBodyTextStyle(tokens, {
      fontSize: 24,
      lineHeightRatio: 1.75,
    }),
    repeat: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginBottom: tokens.spacing.sm,
    },
    itemHighlight: {
      borderWidth: tokens.layout.borderWidth.md,
      borderColor: tokens.colors.primary,
      backgroundColor: tokens.colors.primaryMuted,
    },
  }));

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  useEffect(() => {
    if (!itemId || !items.length) {
      return;
    }
    const index = items.findIndex(item => item.id === itemId);
    if (index >= 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({index, animated: true, viewOffset: 24});
      });
    }
  }, [itemId, items]);

  const renderItem = useCallback(
    ({item}: {item: AdhkarItem}) => {
      const isFocused = itemId != null && item.id === itemId;
      return (
        <Card style={isFocused ? styles.itemHighlight : undefined}>
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
      );
    },
    [itemId, styles, t],
  );

  const listHeader = useCallback(
    () => (
      <>
        <TextView text={t('islamic.adhkar.source')} variant="caption" muted />
        <Spacer size="md" />
      </>
    ),
    [t],
  );

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} navigation={navigation} />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          ref={listRef}
          data={items}
          style={styles.list}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ItemSeparatorComponent={() => <Spacer size="md" />}
        />
      )}
    </ScreenContainer>
  );
};

export default AdhkarDetail;
