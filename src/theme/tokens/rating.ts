import {spacing} from './spacing';

/** Rating component tokens — sizes, gaps, and spring animation config. */
export const rating = {
  size: {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
  },
  starGap: spacing.xxs,
  animation: {
    staggerMs: 45,
    spring: {damping: 14, stiffness: 180},
    pressSpring: {damping: 8, stiffness: 320},
    pressScale: 1.18,
  },
} as const;
