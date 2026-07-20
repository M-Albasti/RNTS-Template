import {spacing} from './spacing';

/** Rating component tokens — sizes, gaps, and animation config. */
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
    /** Timed fill avoids spring overshoot spilling into neighboring stars. */
    fillDurationMs: 220,
    spring: {damping: 14, stiffness: 180},
    pressSpring: {damping: 12, stiffness: 320},
    pressScale: 1.12,
  },
} as const;
