export type WordPuzzleLanguage = 'ar' | 'en';

export type WordPuzzleType =
  | 'image_riddle'
  | 'quran_ayah'
  | 'quran_ayah_count'
  | 'text_riddle';

export type HexCoord = {
  q: number;
  r: number;
};

export type HexLetterCell = HexCoord & {
  id: string;
  letter: string;
};

export type WordPuzzleClue =
  | {
      type: 'image_riddle';
      emojis: string[];
      captionKey?: string;
    }
  | {
      type: 'quran_ayah';
      textKey: string;
    }
  | {
      type: 'quran_ayah_count';
      textKey: string;
    }
  | {
      type: 'text_riddle';
      textKey: string;
    };

export type WordPuzzleItem = {
  id: string;
  type: WordPuzzleType;
  clue: WordPuzzleClue;
  answers: string[];
  grid: HexLetterCell[];
  solutionPath: HexCoord[];
};

export type WordPuzzleStage = {
  id: string;
  number: number;
  titleKey: string;
  puzzles: WordPuzzleItem[];
};

export type WordPuzzleBook = {
  id: string;
  language: WordPuzzleLanguage;
  titleKey: string;
  landKey: string;
  bookmarkNumber: number;
  stages: WordPuzzleStage[];
};

export type WordPuzzleProgress = {
  completedStages: Record<string, string[]>;
  hintsUsed: number;
  gems: number;
};
