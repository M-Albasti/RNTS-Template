export const WORD_PUZZLE_STAGES_PER_BOOK = 50;
/** Inclusive range of clue cards (puzzles) per stage. */
export const WORD_PUZZLE_PUZZLES_PER_STAGE_MIN = 3;
export const WORD_PUZZLE_PUZZLES_PER_STAGE_MAX = 10;
/** @deprecated Prefer `getPuzzlesPerStage(stageNumber)`. Kept as the minimum. */
export const WORD_PUZZLE_PUZZLES_PER_STAGE = WORD_PUZZLE_PUZZLES_PER_STAGE_MIN;
export const WORD_PUZZLE_FETCH_BATCH = 12;

const PUZZLES_PER_STAGE_SPAN =
  WORD_PUZZLE_PUZZLES_PER_STAGE_MAX - WORD_PUZZLE_PUZZLES_PER_STAGE_MIN + 1;

/** Deterministic puzzle count for a stage in [MIN, MAX]. */
export const getPuzzlesPerStage = (stageNumber: number): number => {
  const safeStage = Math.max(1, Math.floor(stageNumber));
  const hash = (safeStage * 7 + 3) % PUZZLES_PER_STAGE_SPAN;
  return WORD_PUZZLE_PUZZLES_PER_STAGE_MIN + hash;
};

/** Index of the first puzzle for this stage in a flat book-wide list. */
export const getStagePuzzleOffset = (stageNumber: number): number => {
  let offset = 0;
  for (let i = 1; i < stageNumber; i += 1) {
    offset += getPuzzlesPerStage(i);
  }
  return offset;
};

/** Total puzzles needed to fill every stage in a book. */
export const getTotalPuzzlesForBook = (): number => {
  let total = 0;
  for (let i = 1; i <= WORD_PUZZLE_STAGES_PER_BOOK; i += 1) {
    total += getPuzzlesPerStage(i);
  }
  return total;
};

export const ENGLISH_RIDDLE_CATEGORIES = [
  'logic',
  'math',
  'mystery',
  'science',
  'funny',
  'who-am-i',
] as const;

export type EnglishRiddleCategory = (typeof ENGLISH_RIDDLE_CATEGORIES)[number];

export const ARABIC_LAND_GROUPS = [
  {landIndex: 1, categoryIds: [1, 2, 3]},
  {landIndex: 2, categoryIds: [4, 5, 6]},
] as const;

export const ENGLISH_LAND_GROUPS = [
  {landIndex: 1, categories: ['logic', 'math', 'mystery'] as EnglishRiddleCategory[]},
  {landIndex: 2, categories: ['science', 'funny', 'who-am-i'] as EnglishRiddleCategory[]},
] as const;
