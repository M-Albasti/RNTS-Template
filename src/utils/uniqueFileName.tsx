import {getUnixTime} from 'date-fns/getUnixTime';

/**
 * Generates a unique file name prefix using Unix timestamp.
 * Replaces moment().unix() — date-fns is already used in this project and is tree-shake friendly.
 */
export const uniqueFileName = (prefix: string, extension?: string): string => {
  const timestamp = getUnixTime(new Date());
  return extension ? `${prefix}-${timestamp}.${extension}` : `${prefix}-${timestamp}`;
};
