/**
 * Semantic color tokens — map brand palette to roles (background, surface, text, etc.).
 * Components should use `tokens.colors.textPrimary`, not raw hex from `@constants/colors`.
 */
export type ColorScheme = 'light' | 'dark';

export type SemanticColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  primaryMuted: string;
  primaryContrast: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  success: string;
  successMuted: string;
  error: string;
  errorMuted: string;
  warning: string;
  overlay: string;
  /** Accent slides / highlights (home carousel) */
  accent1: string;
  accent2: string;
  accent3: string;
};

const lightColors: SemanticColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  primary: '#38BDF8',
  primaryMuted: '#E0F2FE',
  primaryContrast: '#0C4A6E',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  success: '#22C55E',
  successMuted: '#DCFCE7',
  error: '#EF4444',
  errorMuted: '#FEE2E2',
  warning: '#F59E0B',
  overlay: 'rgba(15, 23, 42, 0.45)',
  accent1: '#BAE6FD',
  accent2: '#7DD3FC',
  accent3: '#38BDF8',
};

const darkColors: SemanticColors = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  primary: '#38BDF8',
  primaryMuted: '#0C4A6E',
  primaryContrast: '#E0F2FE',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  textInverse: '#0F172A',
  border: '#334155',
  borderStrong: '#475569',
  success: '#4ADE80',
  successMuted: '#14532D',
  error: '#F87171',
  errorMuted: '#7F1D1D',
  warning: '#FBBF24',
  overlay: 'rgba(0, 0, 0, 0.6)',
  accent1: '#0C4A6E',
  accent2: '#075985',
  accent3: '#0369A1',
};

export const getSemanticColors = (scheme: ColorScheme): SemanticColors =>
  scheme === 'dark' ? darkColors : lightColors;
