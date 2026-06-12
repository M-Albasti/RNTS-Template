import {ZodError} from 'zod';

/**
 * Formats Zod validation errors for user-facing alerts.
 * Zod v4 uses `issues` (v3 used `errors`) — this helper keeps services compatible.
 */
export const formatZodError = (error: ZodError): string => {
  return error.issues.map(issue => issue.message).join('\n');
};
