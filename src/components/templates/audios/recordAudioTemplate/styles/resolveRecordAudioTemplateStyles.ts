import type {ThemeTokens} from '@theme/types';

export const resolveRecordAudioTemplateStyles = (tokens: ThemeTokens) => ({
      timer: {
        ...tokens.typography.h2,
        color: tokens.colors.textPrimary,
        textAlign: 'center',
      },
      hint: {
        textAlign: 'center',
      },
      actions: {
        gap: tokens.spacing.sm,
      },
      statusBadge: {
        alignSelf: 'center',
        backgroundColor: tokens.colors.primaryMuted,
        borderRadius: tokens.radius.full,
        paddingVertical: tokens.spacing.xs,
        paddingHorizontal: tokens.spacing.md,
      },
    });
