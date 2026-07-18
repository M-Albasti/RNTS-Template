import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Pressable, View} from 'react-native';
import {FlashList, type FlashListRef} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import AdhkarAudioBar from '@molecules/islamic/AdhkarAudioBar';

import {useAdhkarCategoryQuery} from '@api/query/hooks/useIslamicQueries';
import {
  DEFAULT_ADHKAR_RECITER_ID,
  getAdhkarReciterById,
  getContinuousTrackUrl,
  getRecitersForSession,
  ADHKAR_RECITERS,
} from '@constants/adhkarReciters';
import {getAdhkarSessionById, type AdhkarSessionId} from '@constants/adhkarSessions';
import {useAdhkarAudioPlayer} from '@hooks/useAdhkarAudioPlayer';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {updateAdhkarPreferences} from '@redux/slices/islamicSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {AdhkarItem} from '@Types/islamicTypes';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'AdhkarReader'>;
  route: AppRouteProp<'AdhkarReader'>;
};

/**
 * Guided adhkar reader — sequential Hisn clips or continuous famous-reciter tracks.
 */
const AdhkarReader = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const savedReciterId = useAppSelector(
    state => state.islamic.adhkarPreferences?.reciterId ?? DEFAULT_ADHKAR_RECITER_ID,
  );

  const sessionId = route.params.sessionId as AdhkarSessionId | undefined;
  const session = sessionId ? getAdhkarSessionById(sessionId) : undefined;
  const categoryId = session?.categoryId ?? route.params.categoryId;
  const title =
    session != null
      ? t(session.titleKey)
      : (route.params.title ?? t('islamic.adhkar.title'));

  const {data, isLoading, isError} = useAdhkarCategoryQuery(categoryId ?? 0, lang);
  const listRef = useRef<FlashListRef<AdhkarItem>>(null);

  const availableReciters = useMemo(() => {
    if (sessionId) {
      return getRecitersForSession(sessionId);
    }
    return ADHKAR_RECITERS.filter(reciter => reciter.id === 'hisn');
  }, [sessionId]);

  const reciterId = useMemo(() => {
    if (availableReciters.some(item => item.id === savedReciterId)) {
      return savedReciterId;
    }
    return availableReciters[0]?.id ?? 'hisn';
  }, [availableReciters, savedReciterId]);

  const reciter = getAdhkarReciterById(reciterId);
  const continuousUrl =
    sessionId && reciter.mode === 'continuous'
      ? getContinuousTrackUrl(sessionId, reciterId)
      : undefined;
  const isContinuous = Boolean(continuousUrl);

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const playableItems = useMemo(
    () => items.filter(item => Boolean(item.audioUrl)),
    [items],
  );

  const scrollToItem = useCallback((itemId: number) => {
    const index = items.findIndex(item => item.id === itemId);
    if (index >= 0) {
      listRef.current?.scrollToIndex({index, animated: true, viewOffset: 24});
    }
  }, [items]);

  const handleItemChange = useCallback(
    (changedItemId: number) => {
      scrollToItem(changedItemId);
    },
    [scrollToItem],
  );

  const audio = useAdhkarAudioPlayer({
    items: playableItems.length ? playableItems : items,
    playlistKey: `${sessionId ?? 'cat'}:${categoryId}:${reciterId}`,
    mode: isContinuous ? 'continuous' : 'sequential',
    continuousUrl,
    onItemChange: handleItemChange,
  });

  const styles = useThemedStyles(tokens => ({
    body: {flex: tokens.layout.flex.fill},
    list: {flex: tokens.layout.flex.fill},
    banner: {
      backgroundColor: tokens.colors.mushafBanner,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.mushafBorder,
    },
    card: {
      backgroundColor: tokens.colors.mushafPage,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.mushafBorder,
      ...tokens.shadows.sm,
    },
    cardActive: {
      borderColor: tokens.colors.mushafOrnament,
      borderWidth: tokens.layout.borderWidth.md,
      backgroundColor: tokens.colors.mushafHighlight,
    },
    arabic: {
      fontSize: tokens.typography.mushafBody?.fontSize ?? tokens.typography.h3.fontSize,
      lineHeight:
        (tokens.typography.mushafBody?.lineHeight ??
          tokens.typography.h3.lineHeight ??
          28) * 1.35,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
      color: tokens.colors.mushafInk,
    },
    repeat: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginBottom: tokens.spacing.sm,
    },
    continuousNote: {
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm,
      marginBottom: tokens.spacing.md,
    },
  }));

  useEffect(() => {
    if (audio.activeItemId == null || isContinuous) {
      return;
    }
    scrollToItem(audio.activeItemId);
  }, [audio.activeItemId, isContinuous, scrollToItem]);

  const listHeader = useCallback(
    () => (
      <>
        <View style={styles.banner}>
          <TextView text={session ? t(session.subtitleKey) : title} variant="bodySmall" />
          <Spacer size="xxs" />
          <TextView text={t('islamic.adhkar.source')} variant="caption" muted />
        </View>
        {isContinuous ? (
          <View style={styles.continuousNote}>
            <TextView text={t('islamic.adhkar.continuousHint')} variant="caption" />
          </View>
        ) : null}
      </>
    ),
    [isContinuous, session, styles.banner, styles.continuousNote, t, title],
  );

  const renderItem = useCallback(
    ({item}: {item: AdhkarItem}) => {
      const isActive =
        !isContinuous && item.id === audio.activeItemId && audio.hasLoadedTrack;
      return (
        <Pressable
          style={[styles.card, isActive && styles.cardActive]}
          onPress={() => {
            if (!isContinuous) {
              audio.playIndex(
                (playableItems.length ? playableItems : items).findIndex(
                  entry => entry.id === item.id,
                ),
              );
            }
          }}>
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
        </Pressable>
      );
    },
    [
      audio,
      isContinuous,
      items,
      playableItems,
      styles.arabic,
      styles.card,
      styles.cardActive,
      styles.repeat,
      t,
    ],
  );

  if (!categoryId) {
    return (
      <ScreenContainer>
        <ScreenHeader title={title} onBack={() => navigation.goBack()} />
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bottomPadding="none" style={styles.body}>
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      {isLoading ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <>
          <FlashList
            ref={listRef}
            data={items}
            style={styles.list}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            ListHeaderComponent={listHeader}
            ItemSeparatorComponent={() => <Spacer size="md" />}
          />
          <AdhkarAudioBar
            title={title}
            activeIndex={audio.activeIndex}
            totalCount={(playableItems.length ? playableItems : items).length}
            isPlaying={audio.isPlaying}
            isLoading={audio.isLoading}
            isContinuous={isContinuous}
            reciterId={reciterId}
            reciters={availableReciters}
            onSelectReciter={id => dispatch(updateAdhkarPreferences({reciterId: id}))}
            onTogglePlay={audio.togglePlay}
            onPrevious={audio.playPrevious}
            onNext={audio.playNext}
          />
        </>
      )}
    </ScreenContainer>
  );
};

export default AdhkarReader;
