import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import ApiErrorView from '@atoms/ApiErrorView';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import ClueCardCarousel from '@organisms/wordPuzzle/ClueCardCarousel';
import HexLetterGrid from '@organisms/wordPuzzle/HexLetterGrid';
import PraiseOverlay from '@organisms/wordPuzzle/PraiseOverlay';
import StageCompleteModal from '@organisms/wordPuzzle/StageCompleteModal';
import WordAnswerSlots from '@organisms/wordPuzzle/WordAnswerSlots';
import {
  useWordPuzzleBookQuery,
  useWordPuzzleStageQuery,
} from '@api/query/hooks/useWordPuzzleQueries';
import {getStageNumberFromId} from '@api/clients/wordPuzzleClient';
import {WORD_PUZZLE_STAGES_PER_BOOK} from '@constants/wordPuzzle/wordPuzzleConfig';
import {
  buildGridForWords,
  findMatchingUnsolvedPuzzle,
  formatSelectionWithWordGaps,
  hexKey,
  normalizeAnswerForDisplay,
  normalizeWord,
} from '@helpers/hexGridHelpers';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {completeStage, spendHint} from '@redux/slices/wordPuzzleSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {HexCoord} from '@Types/wordPuzzleTypes';

type Props = {
  navigation: AppStackNavigationProp<'WordPuzzlePlay'>;
  route: AppRouteProp<'WordPuzzlePlay'>;
};

const PRAISE_KEYS = [
  'wordPuzzle.praiseGood',
  'wordPuzzle.praiseGreat',
  'wordPuzzle.praiseGenius',
  'wordPuzzle.praiseAwesome',
  'wordPuzzle.praiseBrilliant',
] as const;

const WordPuzzlePlay = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const gems = useAppSelector(state => state.wordPuzzle.gems);
  const {bookId, stageId} = route.params;

  useFocusEffect(
    useCallback(() => {
      let parent = navigation.getParent();
      while (parent) {
        const state = parent.getState?.();
        if (state?.type === 'drawer') {
          parent.setOptions({swipeEnabled: false});
          const drawerNav = parent;
          return () => {
            drawerNav.setOptions({swipeEnabled: true});
          };
        }
        parent = parent.getParent();
      }
      return undefined;
    }, [navigation]),
  );

  const {data: book} = useWordPuzzleBookQuery(bookId);
  const {data: stage, isLoading, isError, refetch, isFetching} = useWordPuzzleStageQuery(
    bookId,
    stageId,
  );

  const [clueIndex, setClueIndex] = useState(0);
  const [scrollRequest, setScrollRequest] = useState(0);
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState('');
  const [selectionAccent, setSelectionAccent] = useState<string | undefined>();
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => new Set());
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(() => new Set());
  const [lockedColors, setLockedColors] = useState<Record<string, string>>({});
  const [resetToken, setResetToken] = useState(0);
  const [hintPath, setHintPath] = useState<HexCoord[] | undefined>();
  const [message, setMessage] = useState('');
  const [praiseText, setPraiseText] = useState<string | null>(null);
  const [showStageSuccess, setShowStageSuccess] = useState(false);
  const solvedCardRevealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const language = book?.language ?? 'ar';
  const puzzles = stage?.puzzles ?? [];
  const currentStageNumber = getStageNumberFromId(stageId);
  const hasNextMatch = currentStageNumber < WORD_PUZZLE_STAGES_PER_BOOK;

  useEffect(() => {
    return () => {
      if (solvedCardRevealTimeoutRef.current) {
        clearTimeout(solvedCardRevealTimeoutRef.current);
      }
    };
  }, []);

  const puzzleSignature = useMemo(
    () => puzzles.map(puzzle => `${puzzle.id}:${puzzle.answers[0] ?? ''}`).join('|'),
    [puzzles],
  );

  useEffect(() => {
    if (!stage?.id || puzzles.length === 0) {
      return;
    }
    if (solvedCardRevealTimeoutRef.current) {
      clearTimeout(solvedCardRevealTimeoutRef.current);
      solvedCardRevealTimeoutRef.current = null;
    }
    setCardOrder(puzzles.map(puzzle => puzzle.id));
    setClueIndex(0);
    setSolvedIds(new Set());
    setLockedKeys(new Set());
    setLockedColors({});
    setSelectedLetters('');
    setSelectionAccent(undefined);
    setMessage('');
    setHintPath(undefined);
    setResetToken(value => value + 1);
    setShowStageSuccess(false);
  }, [stage?.id, puzzleSignature]);

  const orderedPuzzles = useMemo(() => {
    if (cardOrder.length === 0) {
      return puzzles;
    }
    const map = new Map(puzzles.map(puzzle => [puzzle.id, puzzle]));
    return cardOrder.map(id => map.get(id)).filter(Boolean) as typeof puzzles;
  }, [cardOrder, puzzles]);

  const sharedBoard = useMemo(() => {
    if (puzzles.length === 0) {
      return {grid: [], solutionPaths: [] as HexCoord[][]};
    }
    const words = puzzles.map(puzzle =>
      normalizeWord(puzzle.answers[0] ?? '', language).replace(/\s+/g, ''),
    );
    const seed = puzzles.reduce((sum, puzzle) => sum + puzzle.id.length, 0);
    return buildGridForWords(words, language, seed);
  }, [language, puzzles]);

  const allSolved = puzzles.length > 0 && solvedIds.size >= puzzles.length;

  const styles = useThemedStyles(tokens => ({
    toolbar: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      backgroundColor: tokens.colors.surface,
    },
    success: {color: tokens.colors.success},
    center: {...tokens.layout.presets.center, padding: tokens.spacing.xl},
    statusBand: {
      height: 40,
      justifyContent: 'center' as const,
      overflow: 'hidden' as const,
    },
    messageLine: {
      height: 22,
      justifyContent: 'center' as const,
      marginTop: 4,
    },
  }));

  const levelLabel = useMemo(() => {
    if (!stage || !book) {
      return '';
    }
    return t('wordPuzzle.levelLabel', {
      stage: stage.number,
      book: book.title,
      puzzle: Math.min(clueIndex + 1, puzzles.length),
      total: puzzles.length,
    });
  }, [book, clueIndex, puzzles.length, stage, t]);

  const progressLabel = useMemo(
    () =>
      t('wordPuzzle.wordsFound', {
        found: solvedIds.size,
        total: puzzles.length,
      }),
    [puzzles.length, solvedIds.size, t],
  );

  const focusAnswerTemplate = useMemo(() => {
    const focus = orderedPuzzles[clueIndex];
    if (!focus) {
      return undefined;
    }
    const spaced = focus.answers.find(answer => /\s/.test(answer));
    const raw = spaced ?? focus.answers[0];
    return raw ? normalizeAnswerForDisplay(raw, language) : undefined;
  }, [clueIndex, language, orderedPuzzles]);

  const displaySelectedLetters = useMemo(
    () => formatSelectionWithWordGaps(selectedLetters, focusAnswerTemplate),
    [focusAnswerTemplate, selectedLetters],
  );

  const maybeShowPraise = useCallback(() => {
    if (Math.random() > 0.48) {
      return;
    }
    const key = PRAISE_KEYS[Math.floor(Math.random() * PRAISE_KEYS.length)];
    setPraiseText(t(key));
  }, [t]);

  const onSelectionChange = useCallback((letters: string, accentColor: string | null) => {
    setSelectedLetters(letters);
    setSelectionAccent(accentColor ?? undefined);
    setHintPath(undefined);
    if (letters.length > 0) {
      setMessage('');
    }
  }, []);

  const onSelectionEnd = useCallback(
    (letters: string, path: HexCoord[], accentColor: string) => {
      if (allSolved || !letters) {
        setSelectedLetters('');
        setSelectionAccent(undefined);
        return;
      }

      const matched = findMatchingUnsolvedPuzzle(letters, puzzles, solvedIds, language);
      if (!matched) {
        setMessage(t('wordPuzzle.tryAgain'));
        setResetToken(value => value + 1);
        setSelectedLetters('');
        setSelectionAccent(undefined);
        return;
      }

      const nextSolved = new Set(solvedIds);
      nextSolved.add(matched.id);
      const nextLocked = new Set(lockedKeys);
      const nextLockedColors = {...lockedColors};
      path.forEach(coord => {
        const key = hexKey(coord);
        nextLocked.add(key);
        nextLockedColors[key] = accentColor;
      });

      const viewingId = orderedPuzzles[clueIndex]?.id;
      // Keep every card visible: unsolved first (same relative order), solved at the end.
      const stillOpen = cardOrder.filter(id => id !== matched.id && !solvedIds.has(id));
      const alreadySolved = cardOrder.filter(id => solvedIds.has(id));
      const nextOrder = [...stillOpen, ...alreadySolved, matched.id];

      // Default: next unsolved after the card that was just solved.
      const oldIndex = cardOrder.indexOf(matched.id);
      const preferredNext =
        stillOpen.find(id => cardOrder.indexOf(id) > oldIndex) ?? stillOpen[stillOpen.length - 1];
      let nextFocusIndex = preferredNext ? nextOrder.indexOf(preferredNext) : 0;
      if (nextFocusIndex < 0) {
        nextFocusIndex = 0;
      }

      const solvedOtherCard = Boolean(viewingId && viewingId !== matched.id);
      const solvedCardIndex = nextOrder.indexOf(matched.id);

      if (solvedCardRevealTimeoutRef.current) {
        clearTimeout(solvedCardRevealTimeoutRef.current);
        solvedCardRevealTimeoutRef.current = null;
      }

      setSolvedIds(nextSolved);
      setLockedKeys(nextLocked);
      setLockedColors(nextLockedColors);
      setCardOrder(nextOrder);
      setSelectedLetters('');
      setSelectionAccent(undefined);
      setHintPath(undefined);
      setMessage(
        nextSolved.size >= puzzles.length
          ? t('wordPuzzle.stageComplete')
          : t('wordPuzzle.correct'),
      );
      setResetToken(value => value + 1);

      if (solvedOtherCard && solvedCardIndex >= 0 && nextSolved.size < puzzles.length) {
        // Briefly show the card that was just solved, then move to the next unsolved.
        setClueIndex(solvedCardIndex);
        setScrollRequest(value => value + 1);
        solvedCardRevealTimeoutRef.current = setTimeout(() => {
          solvedCardRevealTimeoutRef.current = null;
          setClueIndex(nextFocusIndex);
          setScrollRequest(value => value + 1);
        }, 2000);
      } else {
        setClueIndex(nextFocusIndex);
        setScrollRequest(value => value + 1);
      }

      if (nextSolved.size >= puzzles.length) {
        setShowStageSuccess(true);
      } else {
        maybeShowPraise();
      }
    },
    [
      allSolved,
      cardOrder,
      clueIndex,
      language,
      lockedColors,
      lockedKeys,
      maybeShowPraise,
      orderedPuzzles,
      puzzles,
      solvedIds,
      t,
    ],
  );

  const continueAfterStageSuccess = () => {
    dispatch(completeStage({bookId, stageId}));
    setShowStageSuccess(false);
    if (hasNextMatch) {
      const nextStageId = `${bookId}-stage-${currentStageNumber + 1}`;
      navigation.replace('WordPuzzlePlay', {bookId, stageId: nextStageId});
      return;
    }
    navigation.navigate('WordPuzzleStageMap', {bookId});
  };

  const revealHint = () => {
    if (allSolved || puzzles.length === 0) {
      return;
    }
    const focus =
      (orderedPuzzles[clueIndex] && !solvedIds.has(orderedPuzzles[clueIndex].id)
        ? orderedPuzzles[clueIndex]
        : undefined) ??
      orderedPuzzles.find(puzzle => !solvedIds.has(puzzle.id)) ??
      puzzles.find(puzzle => !solvedIds.has(puzzle.id));
    if (!focus) {
      return;
    }
    const focusIndex = puzzles.findIndex(puzzle => puzzle.id === focus.id);
    const path = sharedBoard.solutionPaths[focusIndex] ?? [];
    const unlockedPath = path.filter(coord => !lockedKeys.has(hexKey(coord)));
    if (unlockedPath.length === 0) {
      return;
    }
    dispatch(spendHint());
    setHintPath(unlockedPath);
    setSelectedLetters(normalizeAnswerForDisplay(focus.answers[0], language));
    setSelectionAccent(undefined);
    setMessage(t('wordPuzzle.hintUsed'));
  };

  if (isLoading || isFetching) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('wordPuzzle.title')} navigation={navigation} />
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Spacer size="sm" />
          <TextView text={t('wordPuzzle.loadingStage')} variant="caption" muted />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !book || !stage || puzzles.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('wordPuzzle.title')} navigation={navigation} />
        <ApiErrorView
          message={
            isError
              ? t('wordPuzzle.errors.loadFailed')
              : t('wordPuzzle.stageNotFound')
          }
          retryLabel={t('wordPuzzle.retry')}
          onRetry={() => {
            void refetch();
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('wordPuzzle.title')} navigation={navigation} />
      <View style={styles.toolbar}>
        <TextView text={progressLabel} variant="caption" muted />
        <TextView text={t('wordPuzzle.gems', {count: gems})} variant="caption" />
      </View>
      <Spacer size="sm" />
      <ClueCardCarousel
        puzzles={orderedPuzzles}
        language={language}
        solvedIds={solvedIds}
        levelLabel={levelLabel}
        activeIndex={clueIndex}
        scrollRequest={scrollRequest}
        onIndexChange={setClueIndex}
      />
      <Spacer size="sm" />
      <View style={styles.statusBand}>
        <WordAnswerSlots
          letters={displaySelectedLetters}
          solved={allSolved}
          accentColor={selectionAccent}
          variant={hintPath ? 'hint' : 'selection'}
        />
      </View>
      <HexLetterGrid
        grid={sharedBoard.grid}
        lockedKeys={lockedKeys}
        lockedColors={lockedColors}
        resetToken={resetToken}
        highlightPath={hintPath}
        onSelectionChange={onSelectionChange}
        onSelectionEnd={onSelectionEnd}
      />
      <View style={styles.messageLine}>
        {message ? (
          <TextView
            text={message}
            variant="bodySmall"
            style={
              message === t('wordPuzzle.correct') || message === t('wordPuzzle.stageComplete')
                ? styles.success
                : undefined
            }
            align="center"
            numberOfLines={1}
          />
        ) : null}
      </View>
      <Spacer size="md" />
      <View style={styles.toolbar}>
        <Pressable style={styles.chip} onPress={revealHint} disabled={allSolved}>
          <TextView text={t('wordPuzzle.hint')} variant="caption" />
        </Pressable>
        <Pressable
          style={styles.chip}
          onPress={() => {
            setResetToken(value => value + 1);
            setSelectedLetters('');
            setSelectionAccent(undefined);
            setHintPath(undefined);
            setMessage('');
          }}>
          <TextView text={t('wordPuzzle.clear')} variant="caption" />
        </Pressable>
      </View>
      <Spacer size="sm" />
      <TextView text={t('wordPuzzle.dragHintShared')} variant="caption" muted align="center" />
      <PraiseOverlay text={praiseText} onDismiss={() => setPraiseText(null)} />
      <StageCompleteModal
        visible={showStageSuccess}
        hasNextMatch={hasNextMatch}
        onContinue={continueAfterStageSuccess}
      />
    </ScreenContainer>
  );
};

export default WordPuzzlePlay;
