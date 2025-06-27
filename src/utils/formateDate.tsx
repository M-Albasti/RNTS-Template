// Note the syntax of these imports from the date-fns library.
// If you import with the syntax: import { format } from "date-fns" the ENTIRE library
// will be included in your production bundle (even if you only use one function).
// This is because react-native does not support tree-shaking.
//* packages import
import {type Locale} from 'date-fns/locale';
import {format} from 'date-fns/format';
import {parseISO} from 'date-fns/parseISO';
import i18n from 'i18next';

//* types import
import {Languages} from '@Types/languages';

type Options = Parameters<typeof format>[2];

let dateFnsLocale: Locale;
export const loadDateFnsLocale = () => {
  try {
    // Normalize language code to handle cases like 'ar-SA', 'en-US'
    const primaryTag = i18n.language.split('-')[0].toLowerCase();
    dateFnsLocale = loadDateModule(primaryTag as Languages);

    // Validate that locale was loaded successfully
    if (!dateFnsLocale) {
      console.warn('Failed to load date-fns locale for language:', primaryTag);
      // Fallback to English
      dateFnsLocale = loadDateModule('en');
    }
  } catch (error) {
    console.error('Error loading date-fns locale:', error);
    // Fallback to English locale
    try {
      dateFnsLocale = loadDateModule('en');
    } catch (fallbackError) {
      console.error('Failed to load fallback date-fns locale:', fallbackError);
    }
  }
};

const loadDateModule = (primaryTag: Languages) => {
  const localeModule =
    primaryTag === 'ar'
      ? require('date-fns/locale/ar')
      : require('date-fns/locale/en-US');
  return localeModule.default || localeModule;
};

export const formatDate = (
  date: string,
  dateFormat?: string,
  options?: Options,
) => {
  try {
    // Ensure dateFnsLocale is loaded
    if (!dateFnsLocale) {
      loadDateFnsLocale();
    }

    const dateOptions = {
      ...options,
      locale: dateFnsLocale,
    };
    return format(parseISO(date), dateFormat ?? 'MMM dd, yyyy', dateOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    // Return original date string as fallback
    return date;
  }
};
