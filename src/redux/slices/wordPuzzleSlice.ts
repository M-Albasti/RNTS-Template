import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {WordPuzzleProgress} from '@Types/wordPuzzleTypes';

type WordPuzzleState = WordPuzzleProgress & {
  activeBookId: string | null;
};

const initialState: WordPuzzleState = {
  completedStages: {},
  hintsUsed: 0,
  gems: 1418,
  activeBookId: null,
};

const wordPuzzleSlice = createSlice({
  name: 'wordPuzzle',
  initialState,
  reducers: {
    setActiveBook: (state, action: PayloadAction<string | null>) => {
      state.activeBookId = action.payload;
    },
    completeStage: (state, action: PayloadAction<{bookId: string; stageId: string}>) => {
      const {bookId, stageId} = action.payload;
      const existing = state.completedStages[bookId] ?? [];
      if (!existing.includes(stageId)) {
        state.completedStages[bookId] = [...existing, stageId];
        state.gems += 5;
      }
    },
    spendHint: state => {
      if (state.gems >= 2) {
        state.gems -= 2;
        state.hintsUsed += 1;
      }
    },
  },
});

export const {setActiveBook, completeStage, spendHint} = wordPuzzleSlice.actions;
export default wordPuzzleSlice.reducer;

export const isStageCompleted = (
  progress: WordPuzzleProgress,
  bookId: string,
  stageId: string,
) => progress.completedStages[bookId]?.includes(stageId) ?? false;

export const isStageUnlocked = (
  progress: WordPuzzleProgress,
  bookId: string,
  stageNumber: number,
) => {
  if (stageNumber <= 1) {
    return true;
  }
  const previousStageId = `${bookId}-stage-${stageNumber - 1}`;
  return progress.completedStages[bookId]?.includes(previousStageId) ?? false;
};
