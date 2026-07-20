import type {WordPuzzleLanguage} from '@Types/wordPuzzleTypes';

import {
  WORD_PUZZLE_MAX_ANSWER_LETTERS,
  WORD_PUZZLE_MAX_ANSWER_WORDS,
} from '@constants/wordPuzzle/wordPuzzleConfig';
import {normalizeWord} from './hexGridHelpers';

const stripForLength = (value: string) =>
  value
    .replace(/[\s\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[^\u0600-\u06FFa-zA-Z]/g, '');

const splitWords = (value: string): string[] =>
  value
    .trim()
    .split(/\s+/)
    .map(part => part.trim())
    .filter(Boolean);

const isScriptToken = (token: string, language: WordPuzzleLanguage): boolean => {
  const compact = stripForLength(token);
  if (compact.length < 1) {
    return false;
  }
  if (language === 'en') {
    return /^[a-zA-Z]+$/.test(compact);
  }
  return /[\u0600-\u06FF]/.test(compact);
};

/**
 * Accept only answers with ≤3 words and ≤13 letters total (compact).
 * Returns the cleaned spaced phrase, or null when the answer is unusable.
 */
export const sanitizeAnswerPhrase = (
  rawAnswer: string,
  language: WordPuzzleLanguage,
): string | null => {
  const words = splitWords(rawAnswer);
  if (words.length === 0 || words.length > WORD_PUZZLE_MAX_ANSWER_WORDS) {
    return null;
  }
  if (!words.every(word => isScriptToken(word, language))) {
    return null;
  }

  const cleanedWords = words.map(word => stripForLength(word)).filter(Boolean);
  if (cleanedWords.length === 0 || cleanedWords.length > WORD_PUZZLE_MAX_ANSWER_WORDS) {
    return null;
  }

  const compact = normalizeWord(cleanedWords.join(''), language);
  if (compact.length < 2 || compact.length > WORD_PUZZLE_MAX_ANSWER_LETTERS) {
    return null;
  }

  return cleanedWords.join(' ');
};

/** Compact board letters for a valid answer only — never slices a long phrase. */
export const pickSpellableAnswer = (
  rawAnswer: string,
  language: WordPuzzleLanguage,
): string | null => {
  const phrase = sanitizeAnswerPhrase(rawAnswer, language);
  return phrase ? normalizeWord(phrase, language) : null;
};

export const buildAnswerVariants = (
  answer: string,
  language: WordPuzzleLanguage,
): string[] => {
  const phrase = sanitizeAnswerPhrase(answer, language);
  if (!phrase) {
    return [];
  }
  const normalized = normalizeWord(phrase, language);
  const variants = new Set(
    [phrase, normalized, phrase.replace(/\s+/g, '')].filter(Boolean),
  );
  return Array.from(variants);
};

/** Compact board word — same rules as sanitize (≤3 words, ≤13 letters total). */
export const pickBoardWord = (
  rawAnswer: string,
  language: WordPuzzleLanguage,
): string | null => pickSpellableAnswer(rawAnswer, language);
