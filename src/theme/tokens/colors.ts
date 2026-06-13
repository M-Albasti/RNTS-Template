import type {ColorScheme, SemanticColors} from '@theme/types';

import {darkColors} from './colors.dark';
import {lightColors} from './colors.light';

export const getSemanticColors = (scheme: ColorScheme): SemanticColors =>
  scheme === 'dark' ? darkColors : lightColors;

export {darkColors} from './colors.dark';
export {lightColors} from './colors.light';
