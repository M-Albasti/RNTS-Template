import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import HexLetterGrid from '@organisms/wordPuzzle/HexLetterGrid';
import PuzzleCluePanel from '@organisms/wordPuzzle/PuzzleCluePanel';
import WordAnswerSlots from '@organisms/wordPuzzle/WordAnswerSlots';
import {getBookById, getStageById} from '@constants/wordPuzzle/wordPuzzleCatalog';
import {isAnswerMatch, normalizeWord} from '@helpers/hexGridHelpers';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {completeStage, useHint} from '@redux/slices/wordPuzzleSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {HexCoord} from '@Types/wordPuzzleTypes';

type Props = {
  navigation: AppStackNavigationProp<'WordPuzzlePlay'>;
  route: AppRouteProp<'WordPuzzlePlay'>;
};

const WordPuzzlePlay = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const gems = useAppSelector(state => state.wordPuzzle.gems);
  const {bookId, stageId} = route.params;
  const book = getBookById(bookId);
  const stage = getStageById(bookId, stageId);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [filledWord, setFilledWord] = useState('');
  const [solved, setSolved] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [hintPath, setHintPath] = useState<HexCoord[] | undefined>();
  const [message, setMessage] = useState('');

  const puzzle = stage?.puzzles[puzzleIndex];
  const language = book?.language ?? 'ar';

  const styles = useThemedStyles(tokens => ({
    toolbar: {...tokens.layout.presets.rowBetween, alignItems: 'center' as const},
    chip: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    dots: {...tokens.layout.presets.row, gap: tokens.spacing.xs, justifyContent: 'center' as const},
    dot: {
      width: 8,
      height: 8,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.border,
    },
    dotActive: {backgroundColor: tokens.colors.primary, width: 16},
    success: {color: tokens.colors.success},
  }));

  const levelLabel = useMemo(() => {
    if (!stage || !book) {
      return '';
    }
    return t('wordPuzzle.levelLabel', {
      stage: stage.number,
      book: t(book.landKey),
      puzzle: puzzleIndex + 1,
      total: stage.puzzles.length,
    });
  }, [book, puzzleIndex, stage, t]);

  const onSelectionEnd = useCallback(
    (letters: string) => {
      if (!puzzle || solved) {
        return;
      }
      setFilledWord(letters);
      if (isAnswerMatch(letters, puzzle.answers, language)) {
        setSolved(true);
        setMessage(t('wordPuzzle.correct'));
      } else {
        setMessage(t('wordPuzzle.tryAgain'));
        setResetToken(value => value + 1);
        setFilledWord('');
      }
    },
    [language, puzzle, solved, t],
  );

  const goNext = () => {
    if (!stage || !book) {
      return;
    }
    if (puzzleIndex < stage.puzzles.length - 1) {
      setPuzzleIndex(value => value + 1);
      setSolved(false);
      setFilledWord('');
      setHintPath(undefined);
      setMessage('');
      setResetToken(value => value + 1);
      return;
    }
    dispatch(completeStage({bookId, stageId}));
    navigation.goBack();
  };

  const revealHint = () => {
    if (!puzzle || solved) {
      return;
    }
    dispatch(useHint());
    setHintPath(puzzle.solutionPath);
    setFilledWord(normalizeWord(puzzle.answers[0], language));
    setMessage(t('wordPuzzle.hintUsed'));
  };

  if (!book || !stage || !puzzle) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('wordPuzzle.title')} onBack={() => navigation.goBack()} />
        <TextView text={t('wordPuzzle.stageNotFound')} muted />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('wordPuzzle.title')} onBack={() => navigation.goBack()} />
      <View style={styles.toolbar}>
        <TextView text={levelLabel} variant="caption" muted />
        <TextView text={t('wordPuzzle.gems', {count: gems})} variant="caption" />
      </View>
      <Spacer size="sm" />
      <PuzzleCluePanel clue={puzzle.clue} language={language} levelLabel={levelLabel} />
      <Spacer size="md" />
      <View style={styles.dots}>
        {stage.puzzles.map((item, index) => (
          <View key={item.id} style={[styles.dot, index === puzzleIndex && styles.dotActive]} />
        ))}
      </View>
      <Spacer size="sm" />
      <WordAnswerSlots
        targetLength={puzzle.answers[0].replace(/\s+/g, '').length}
        filledLetters={filledWord}
        solved={solved}
      />
      <Spacer size="sm" />
      {message ? (
        <TextView text={message} variant="bodySmall" style={solved ? styles.success : undefined} align="center" />
      ) : null}
      <HexLetterGrid
        grid={puzzle.grid}
        resetToken={resetToken}
        highlightPath={hintPath}
        onSelectionEnd={onSelectionEnd}
      />
      <Spacer size="md" />
      <View style={styles.toolbar}>
        <Pressable style={styles.chip} onPress={revealHint}>
          <TextView text={t('wordPuzzle.hint')} variant="caption" />
        </Pressable>
        <Pressable
          style={styles.chip}
          onPress={() => {
            setResetToken(value => value + 1);
            setFilledWord('');
            setHintPath(undefined);
            setMessage('');
          }}>
          <TextView text={t('wordPuzzle.clear')} variant="caption" />
        </Pressable>
      </View>
      {solved ? (
        <>
          <Spacer size="md" />
          <Button label={t('wordPuzzle.next')} fullWidth onPress={goNext} />
        </>
      ) : null}
      <Spacer size="sm" />
      <TextView text={t('wordPuzzle.dragHint')} variant="caption" muted align="center" />
    </ScreenContainer>
  );
};

export default WordPuzzlePlay;
