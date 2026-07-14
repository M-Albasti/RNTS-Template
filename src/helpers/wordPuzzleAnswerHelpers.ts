import type {WordPuzzleLanguage} from '@Types/wordPuzzleTypes';

import {normalizeWord} from './hexGridHelpers';

const stripForLength = (value: string) =>
  value
    .replace(/[\s\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[^\u0600-\u06FFa-zA-Z]/g, '');

export const pickSpellableAnswer = (
  rawAnswer: string,
  language: WordPuzzleLanguage,
): string | null => {
  const candidates = [
    rawAnswer.trim(),
    ...rawAnswer.split(/\s+/).filter(Boolean),
  ];

  for (const candidate of candidates) {
    const compact = stripForLength(candidate);
    if (language === 'en') {
      if (/^[a-zA-Z]{2,15}$/.test(compact)) {
        return compact;
      }
      continue;
    }
    if (compact.length >= 2 && compact.length <= 12 && /[\u0600-\u06FF]/.test(compact)) {
      return compact;
    }
  }

  return null;
};

export const buildAnswerVariants = (answer: string, language: WordPuzzleLanguage) => {
  const trimmed = answer.trim().replace(/\s+/g, ' ');
  const normalized = normalizeWord(answer, language);
  const variants = new Set(
    [trimmed, normalized, trimmed.replace(/\s+/g, '')].filter(Boolean),
  );
  return Array.from(variants);
};

/** Compact board word: prefer full answer (spaces removed) when it fits length limits. */
export const pickBoardWord = (
  rawAnswer: string,
  language: WordPuzzleLanguage,
): string | null => {
  const fullCompact = normalizeWord(rawAnswer, language);
  if (language === 'en') {
    if (/^[a-z]{2,15}$/.test(fullCompact)) {
      return fullCompact;
    }
  } else if (
    fullCompact.length >= 2 &&
    fullCompact.length <= 12 &&
    /[\u0600-\u06FF]/.test(fullCompact)
  ) {
    return fullCompact;
  }
  return pickSpellableAnswer(rawAnswer, language);
};
