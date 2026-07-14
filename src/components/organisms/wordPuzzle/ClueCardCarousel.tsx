import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import PuzzleCluePanel from '@organisms/wordPuzzle/PuzzleCluePanel';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import type {WordPuzzleItem, WordPuzzleLanguage} from '@Types/wordPuzzleTypes';

type Props = {
  puzzles: WordPuzzleItem[];
  language: WordPuzzleLanguage;
  solvedIds: Set<string>;
  levelLabel: string;
  activeIndex: number;
  scrollRequest?: number;
  onIndexChange?: (index: number) => void;
};

const CARD_HEIGHT = 168;

const SolvedBadge = (): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    solvedBadge: {
      position: 'absolute' as const,
      top: tokens.spacing.sm,
      right: tokens.spacing.sm,
      zIndex: 2,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 2,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.successMuted,
    },
    solvedText: {color: tokens.colors.success},
  }));

  return (
    <Animated.View
      entering={ZoomIn.springify().damping(12).stiffness(180)}
      style={styles.solvedBadge}>
      <TextView text={t('wordPuzzle.solvedBadge')} variant="caption" style={styles.solvedText} />
    </Animated.View>
  );
};

const ClueCard = ({
  item,
  solved,
  language,
  levelLabel,
  isActive,
  pageWidth,
  styles,
}: {
  item: WordPuzzleItem;
  solved: boolean;
  language: WordPuzzleLanguage;
  levelLabel: string;
  isActive: boolean;
  pageWidth: number;
  styles: Record<string, object>;
}): React.JSX.Element => {
  const scale = useSharedValue(isActive ? 1 : 0.96);
  const opacity = useSharedValue(isActive ? 1 : 0.88);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.96, {damping: 16, stiffness: 200});
    opacity.value = withTiming(isActive ? 1 : 0.88, {duration: 200});
  }, [isActive, opacity, scale]);

  useEffect(() => {
    if (!solved) {
      return;
    }
    scale.value = withSequence(
      withSpring(1.04, {damping: 10, stiffness: 220}),
      withSpring(isActive ? 1 : 0.96, {damping: 14, stiffness: 180}),
    );
  }, [isActive, scale, solved]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      layout={LinearTransition.duration(320).easing(Easing.out(Easing.cubic))}
      style={[styles.cardWrap, pageWidth > 0 ? {width: pageWidth} : undefined, animatedStyle]}>
      <View style={styles.cardInner}>
        {solved ? <SolvedBadge /> : null}
        <PuzzleCluePanel clue={item.clue} language={language} levelLabel={levelLabel} />
      </View>
    </Animated.View>
  );
};

const ClueCardCarousel = ({
  puzzles,
  language,
  solvedIds,
  levelLabel,
  activeIndex,
  scrollRequest = 0,
  onIndexChange,
}: Props): React.JSX.Element => {
  const [pageWidth, setPageWidth] = useState(0);
  const listRef = useRef<FlatList<WordPuzzleItem>>(null);
  const activeIndexRef = useRef(activeIndex);
  const onIndexChangeRef = useRef(onIndexChange);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  activeIndexRef.current = activeIndex;
  onIndexChangeRef.current = onIndexChange;

  const styles = useThemedStyles(tokens => ({
    wrap: {width: '100%' as const},
    list: {
      height: CARD_HEIGHT,
    },
    cardWrap: {
      height: CARD_HEIGHT,
      paddingHorizontal: tokens.spacing.xs,
    },
    cardInner: {
      flex: 1,
      position: 'relative' as const,
    },
    dots: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.xs,
      justifyContent: 'center' as const,
      marginTop: tokens.spacing.sm,
      minHeight: 20,
      alignItems: 'center' as const,
    },
    dotHit: {
      paddingHorizontal: 4,
      paddingVertical: 6,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    dot: {
      height: 8,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.border,
    },
    dotActive: {backgroundColor: tokens.colors.primary},
    dotSolved: {backgroundColor: tokens.colors.success},
  }));

  const setActiveIndex = useCallback((next: number) => {
    if (next < 0 || next >= puzzles.length) {
      return;
    }
    if (next === activeIndexRef.current) {
      return;
    }
    onIndexChangeRef.current?.(next);
  }, [puzzles.length]);

  const scrollToCard = useCallback(
    (index: number, animated: boolean) => {
      if (pageWidth <= 0 || puzzles.length === 0 || !listRef.current) {
        return;
      }
      const clamped = Math.min(Math.max(index, 0), puzzles.length - 1);
      isProgrammaticScrollRef.current = true;
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
      listRef.current.scrollToOffset({
        offset: clamped * pageWidth,
        animated,
      });
      programmaticTimerRef.current = setTimeout(
        () => {
          isProgrammaticScrollRef.current = false;
          programmaticTimerRef.current = null;
        },
        animated ? 400 : 50,
      );
    },
    [pageWidth, puzzles.length],
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next > 0 && Math.abs(next - pageWidth) > 1) {
      setPageWidth(next);
    }
  };

  useEffect(() => {
    return () => {
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
    };
  }, []);

  // Parent-driven jumps (solve flow bumps scrollRequest).
  useEffect(() => {
    if (pageWidth <= 0 || puzzles.length === 0) {
      return;
    }
    scrollToCard(activeIndex, true);
    // intentionally not depending on activeIndex — user swipes update dots via onMomentumScrollEnd only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRequest, pageWidth, puzzles.length]);

  const syncIndexFromOffset = useCallback(
    (offsetX: number) => {
      if (pageWidth <= 0 || puzzles.length === 0) {
        return;
      }
      const next = Math.round(offsetX / pageWidth);
      setActiveIndex(Math.min(Math.max(next, 0), puzzles.length - 1));
    },
    [pageWidth, puzzles.length, setActiveIndex],
  );

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    syncIndexFromOffset(event.nativeEvent.contentOffset.x);
    isProgrammaticScrollRef.current = false;
  };

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const vx = event.nativeEvent.velocity?.x ?? 0;
    if (Math.abs(vx) < 0.1) {
      syncIndexFromOffset(event.nativeEvent.contentOffset.x);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isProgrammaticScrollRef.current || pageWidth <= 0) {
      return;
    }
    // Keep the active dot in sync while the user is swiping.
    const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setActiveIndex(Math.min(Math.max(next, 0), puzzles.length - 1));
  };

  const goToIndex = useCallback(
    (index: number) => {
      if (pageWidth <= 0 || index < 0 || index >= puzzles.length) {
        return;
      }
      setActiveIndex(index);
      scrollToCard(index, true);
    },
    [pageWidth, puzzles.length, scrollToCard, setActiveIndex],
  );

  const renderItem = ({item, index}: ListRenderItemInfo<WordPuzzleItem>) => (
    <ClueCard
      item={item}
      solved={solvedIds.has(item.id)}
      language={language}
      levelLabel={levelLabel}
      isActive={index === activeIndex}
      pageWidth={pageWidth}
      styles={styles}
    />
  );

  return (
    <Animated.View entering={FadeIn.duration(280)} style={styles.wrap} onLayout={onLayout}>
      {pageWidth > 0 ? (
        <View style={styles.list}>
          <FlatList
            ref={listRef}
            data={puzzles}
            extraData={`${scrollRequest}-${activeIndex}-${[...solvedIds].join(',')}`}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={pageWidth}
            snapToAlignment="start"
            disableIntervalMomentum
            bounces={false}
            renderItem={renderItem}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollEndDrag={onScrollEndDrag}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onScrollToIndexFailed={({index}) => {
              scrollToCard(index, false);
            }}
            getItemLayout={(_, itemIndex) => ({
              length: pageWidth,
              offset: pageWidth * itemIndex,
              index: itemIndex,
            })}
          />
        </View>
      ) : (
        <View style={styles.list} />
      )}
      <View style={styles.dots}>
        {puzzles.map((item, dotIndex) => {
          const active = dotIndex === activeIndex;
          const solved = solvedIds.has(item.id);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Clue ${dotIndex + 1}`}
              accessibilityState={{selected: active}}
              hitSlop={8}
              onPress={() => goToIndex(dotIndex)}
              style={styles.dotHit}>
              <Animated.View
                layout={LinearTransition.springify().damping(16)}
                style={[
                  styles.dot,
                  {width: active ? 16 : 8},
                  active && styles.dotActive,
                  solved && styles.dotSolved,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default ClueCardCarousel;
