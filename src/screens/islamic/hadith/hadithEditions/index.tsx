import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import type {HadithCollectionFilter} from '@api/clients/hadithClient';
import {useHadithEditionsQuery} from '@api/query/hooks/useIslamicQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {HadithEdition} from '@Types/islamicTypes';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'HadithEditions'>;
  route: AppRouteProp<'HadithEditions'>;
};

/** Filtered book list with the same bilingual card design as the Hadith hub. */
const HadithEditions = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const {sizes, colors} = useThemeTokens();
  const filter = route.params.filter as HadithCollectionFilter;
  const title = route.params.title;
  const [query, setQuery] = useState('');
  const {data, isLoading, isError} = useHadithEditionsQuery();

  const styles = useThemedStyles(tokens => ({
    list: {flex: tokens.layout.flex.fill},
    banner: {
      backgroundColor: tokens.colors.hadithChrome,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
    },
    bannerText: {color: tokens.colors.hadithOnChrome},
    card: {
      ...tokens.layout.presets.row,
      alignItems: 'center' as const,
      gap: tokens.spacing.sm,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.sm,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    cardPressed: {backgroundColor: tokens.colors.surfaceSecondary, ...tokens.shadows.none},
    index: {width: tokens.sizes.touchTarget, ...tokens.layout.presets.center},
    indexText: {
      color: tokens.colors.hadithChrome,
      fontSize: tokens.typography.h2.fontSize,
      fontWeight: '700' as const,
    },
    mid: {flex: tokens.layout.flex.fill, gap: tokens.spacing.xxs},
    arabic: {
      color: tokens.colors.hadithChrome,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
      fontSize: tokens.typography.h3.fontSize,
    },
    play: {
      width: tokens.sizes.touchTarget,
      height: tokens.sizes.touchTarget,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.hadithChrome,
      ...tokens.layout.presets.center,
    },
  }));

  const editions = useMemo(() => {
    let list = data ?? [];
    // Weak is grade-based when opening a list — do not equate with sunan-only.
    if (filter === 'sahih') {
      list = list.filter(item => item.category === 'sahih');
    }
    const q = query.trim().toLowerCase();
    if (!q) {
      return list;
    }
    return list.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.nameAr.includes(query.trim()) ||
        String(item.hadithCount).includes(q),
    );
  }, [data, filter, query]);

  const openEdition = useCallback(
    (item: HadithEdition) => {
      navigation.navigate('HadithList', {
        slug: item.slug,
        title: isAr && item.nameAr ? item.nameAr : item.name,
        filter,
      });
    },
    [filter, isAr, navigation],
  );

  const renderBook = useCallback(
    ({item, index}: {item: HadithEdition; index: number}) => (
      <Pressable
        style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => openEdition(item)}>
        <View style={styles.index}>
          <TextView text={String(index + 1)} style={styles.indexText} />
        </View>
        <View style={styles.mid}>
          <Heading text={item.name} level="h3" />
          <TextView
            text={t('islamic.hadith.ahadithCount', {count: item.hadithCount})}
            variant="caption"
            muted
          />
          {item.nameAr ? <TextView text={item.nameAr} style={styles.arabic} /> : null}
        </View>
        <View style={styles.play}>
          <IconView
            iconType="Ionicons"
            name="play"
            size={sizes.iconSm}
            color={colors.hadithOnChrome}
          />
        </View>
      </Pressable>
    ),
    [colors.hadithOnChrome, openEdition, sizes.iconSm, styles, t],
  );

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      <View style={styles.banner}>
        <TextView
          text={t('islamic.hadith.editionsBanner')}
          variant="bodySmall"
          style={styles.bannerText}
        />
      </View>
      <TextInputView
        placeholder={t('islamic.hadith.filterBooksPlaceholder')}
        value={query}
        onChangeText={setQuery}
        leftIcon={
          <IconView iconType="Ionicons" name="search-outline" size={sizes.iconSm} />
        }
      />
      <Spacer size="md" />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <FlashList
          data={editions}
          style={styles.list}
          keyExtractor={item => item.slug}
          drawDistance={600}
          ListEmptyComponent={
            <TextView text={t('islamic.hadith.noBooks')} variant="bodySmall" muted />
          }
          renderItem={renderBook}
        />
      )}
    </ScreenContainer>
  );
};

export default HadithEditions;
