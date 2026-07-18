import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import type {HadithCollectionFilter} from '@api/clients/hadithClient';
import {useHadithEditionsQuery} from '@api/query/hooks/useIslamicQueries';
import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {HadithEdition} from '@Types/islamicTypes';
import type {AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {navigation: AppStackNavigationProp<'HadithHub'>};

type QuickAction = {
  id: string;
  labelKey: string;
  icon: string;
  onPress: () => void;
};

/**
 * Hadith library hub — teal chrome, quick actions, bilingual book cards, resume FAB.
 */
const HadithHub = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const {sizes, colors} = useThemeTokens();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<HadithCollectionFilter>('all');
  const lastHadith = useAppSelector(state => state.islamic.lastHadith);
  const {data, isLoading, isError} = useHadithEditionsQuery();

  const styles = useThemedStyles(tokens => ({
    body: {flex: tokens.layout.flex.fill},
    chrome: {
      backgroundColor: tokens.colors.hadithChrome,
      marginHorizontal: -tokens.spacing.md,
      paddingHorizontal: tokens.spacing.md,
      paddingBottom: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
    },
    headerRow: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
      marginBottom: tokens.spacing.sm,
    },
    headerTitle: {color: tokens.colors.hadithOnChrome, flex: tokens.layout.flex.fill},
    actions: {
      ...tokens.layout.presets.rowBetween,
      gap: tokens.spacing.xs,
      marginBottom: tokens.spacing.sm,
    },
    action: {
      flex: tokens.layout.flex.fill,
      alignItems: 'center' as const,
      gap: tokens.spacing.xxs,
      paddingVertical: tokens.spacing.xs,
    },
    actionLabel: {color: tokens.colors.hadithOnChrome, textAlign: 'center' as const},
    filterRow: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.xs,
      flexWrap: 'wrap' as const,
      marginBottom: tokens.spacing.sm,
    },
    chip: {
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      backgroundColor: tokens.colors.hadithChromeMuted,
    },
    chipActive: {backgroundColor: tokens.colors.hadithAccent},
    chipText: {color: tokens.colors.hadithOnChrome},
    list: {flex: tokens.layout.flex.fill},
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
    index: {
      width: tokens.sizes.touchTarget,
      ...tokens.layout.presets.center,
    },
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
    listContent: {paddingBottom: tokens.spacing.md},
    listContentResume: {paddingBottom: tokens.sizes.touchTarget * 2.5},
    resumeWrap: {
      position: 'absolute' as const,
      start: tokens.spacing.md,
      end: tokens.spacing.md,
      bottom: tokens.spacing.md,
    },
    resume: {
      ...tokens.layout.presets.row,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: tokens.spacing.sm,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.full,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.md,
      borderColor: tokens.colors.hadithChrome,
      ...tokens.shadows.lg,
    },
  }));

  const editions = useMemo(() => {
    let list = data ?? [];
    if (filter === 'sahih') {
      list = list.filter(item => item.category === 'sahih');
    } else if (filter === 'weak') {
      list = list.filter(item => item.category === 'sunan');
    }
    const q = query.trim().toLowerCase();
    if (!q) {
      return list;
    }
    return list.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.nameAr.includes(query.trim()) ||
        String(item.hadithCount).includes(q) ||
        item.slug.includes(q),
    );
  }, [data, filter, query]);

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: 'find',
        labelKey: 'islamic.hadith.findHadith',
        icon: 'log-in-outline',
        onPress: () => setFilter('sahih'),
      },
      {
        id: 'search',
        labelKey: 'islamic.hadith.search',
        icon: 'search-outline',
        onPress: () => navigation.navigate('HadithSearch'),
      },
      {
        id: 'bookmarks',
        labelKey: 'islamic.hadith.bookmarks',
        icon: 'bookmark-outline',
        onPress: () =>
          navigation.navigate('HadithEditions', {
            filter: 'sahih',
            title: t('islamic.hadith.sahih'),
          }),
      },
      {
        id: 'all',
        labelKey: 'islamic.hadith.allCollections',
        icon: 'library-outline',
        onPress: () => setFilter('all'),
      },
    ],
    [navigation, t],
  );

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
          {item.nameAr ? (
            <TextView text={item.nameAr} style={styles.arabic} />
          ) : null}
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
    <ScreenContainer bottomPadding="xxl" style={styles.body}>
      <View style={styles.chrome}>
        <View style={styles.headerRow}>
          <TouchableIcon
            iconType="Ionicons"
            name="chevron-back"
            size={sizes.iconSm}
            color={colors.hadithOnChrome}
            onPress={() => navigation.goBack()}
          />
          <Heading
            text={t('islamic.hadith.title')}
            level="h3"
            align="center"
            style={styles.headerTitle}
          />
          <TouchableIcon
            iconType="Ionicons"
            name="search-outline"
            size={sizes.iconSm}
            color={colors.hadithOnChrome}
            onPress={() => navigation.navigate('HadithSearch')}
          />
        </View>
        <View style={styles.actions}>
          {quickActions.map(action => (
            <Pressable key={action.id} style={styles.action} onPress={action.onPress}>
              <IconView
                iconType="Ionicons"
                name={action.icon}
                size={sizes.iconSm}
                color={colors.hadithAccent}
              />
              <TextView
                text={t(action.labelKey)}
                variant="caption"
                style={styles.actionLabel}
                numberOfLines={1}
              />
            </Pressable>
          ))}
        </View>
        <TextInputView
          placeholder={t('islamic.hadith.filterBooksPlaceholder')}
          value={query}
          onChangeText={setQuery}
          leftIcon={
            <IconView iconType="Ionicons" name="search-outline" size={sizes.iconSm} />
          }
        />
        <Spacer size="sm" />
        <View style={styles.filterRow}>
          {(['all', 'sahih', 'weak'] as HadithCollectionFilter[]).map(item => (
            <Pressable
              key={item}
              style={[styles.chip, filter === item && styles.chipActive]}
              onPress={() => setFilter(item)}>
              <TextView
                text={t(`islamic.hadith.filters.${item}`)}
                variant="caption"
                style={styles.chipText}
              />
            </Pressable>
          ))}
        </View>
      </View>

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
          contentContainerStyle={
            lastHadith ? styles.listContentResume : styles.listContent
          }
          ListEmptyComponent={
            <TextView text={t('islamic.hadith.noBooks')} variant="bodySmall" muted />
          }
          renderItem={renderBook}
        />
      )}

      {lastHadith ? (
        <View style={styles.resumeWrap}>
          <Pressable
            style={styles.resume}
            onPress={() =>
              navigation.navigate('HadithDetail', {
                hadithId: lastHadith.hadithId,
                title: lastHadith.editionName,
              })
            }>
            <IconView
              iconType="Ionicons"
              name="time-outline"
              size={sizes.iconSm}
              color={colors.hadithChrome}
            />
            <TextView text={t('islamic.hadith.resumeReading')} variant="bodySmall" />
          </Pressable>
        </View>
      ) : null}
    </ScreenContainer>
  );
};

export default HadithHub;
