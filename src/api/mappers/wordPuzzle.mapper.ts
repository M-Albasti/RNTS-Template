import {buildGridForWord} from '@helpers/hexGridHelpers';
import {buildAnswerVariants, pickBoardWord} from '@helpers/wordPuzzleAnswerHelpers';
import type {
  EnglishRiddleDto,
  IslamicQuizCategoryDto,
  IslamicQuizQuestionDto,
} from '@api/server/wordPuzzle.dto';
import {
  ENGLISH_RIDDLE_CATEGORIES,
  WORD_PUZZLE_STAGES_PER_BOOK,
  type EnglishRiddleCategory,
} from '@constants/wordPuzzle/wordPuzzleConfig';
import type {
  WordPuzzleBookSummary,
  WordPuzzleItem,
  WordPuzzleLanguage,
  WordPuzzleStage,
  WordPuzzleStageSummary,
} from '@Types/wordPuzzleTypes';

export const mapArabicCategoryToBook = (
  category: IslamicQuizCategoryDto,
  bookmarkNumber: number,
): WordPuzzleBookSummary => ({
  id: `ar-cat-${category.id}`,
  language: 'ar',
  title: category.arabicName,
  description: category.description,
  bookmarkNumber,
  stageCount: WORD_PUZZLE_STAGES_PER_BOOK,
  source: 'islamicquiz',
  sourceMeta: {categoryId: category.id},
});

export const mapEnglishCategoryToBook = (
  category: EnglishRiddleCategory,
  bookmarkNumber: number,
): WordPuzzleBookSummary => ({
  id: `en-riddle-${category}`,
  language: 'en',
  title: category.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
  description: `${category} riddles`,
  bookmarkNumber,
  stageCount: WORD_PUZZLE_STAGES_PER_BOOK,
  source: 'riddles-api',
  sourceMeta: {category},
});

export const mapIslamicQuestionToPuzzle = (
  question: IslamicQuizQuestionDto,
  seed: number,
): WordPuzzleItem | null => {
  const correct = question.answers.find(item => item.t === 1)?.answer;
  if (!correct) {
    return null;
  }
  const spellable = pickBoardWord(correct, 'ar');
  if (!spellable) {
    return null;
  }
  const {grid, solutionPath} = buildGridForWord(spellable, 'ar', seed);
  return {
    id: `ar-q-${question.id}`,
    type: 'text_riddle',
    clue: {type: 'text_riddle', text: question.q},
    answers: buildAnswerVariants(correct, 'ar'),
    grid,
    solutionPath,
    sourceUrl: question.link,
  };
};

export const mapEnglishRiddleToPuzzle = (
  riddle: EnglishRiddleDto,
  index: number,
  category: string,
): WordPuzzleItem | null => {
  const spellable = pickBoardWord(riddle.answer, 'en');
  if (!spellable) {
    return null;
  }
  const {grid, solutionPath} = buildGridForWord(spellable, 'en', index);
  return {
    id: `en-${category}-${index}`,
    type: 'text_riddle',
    clue: {type: 'text_riddle', text: riddle.riddle},
    answers: buildAnswerVariants(riddle.answer, 'en'),
    grid,
    solutionPath,
  };
};

export const buildStageSummaries = (bookId: string): WordPuzzleStageSummary[] =>
  Array.from({length: WORD_PUZZLE_STAGES_PER_BOOK}, (_, index) => ({
    id: `${bookId}-stage-${index + 1}`,
    number: index + 1,
    title: String(index + 1),
  }));

export const buildStageFromPuzzles = (
  bookId: string,
  stageNumber: number,
  puzzles: WordPuzzleItem[],
): WordPuzzleStage => ({
  id: `${bookId}-stage-${stageNumber}`,
  number: stageNumber,
  title: String(stageNumber),
  puzzles,
});

export const englishCategoryLabels = ENGLISH_RIDDLE_CATEGORIES;
