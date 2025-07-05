//* packages import
import {I18nManager} from 'react-native';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {delay} from 'lodash';

//* redux import
import {addLanguage} from '@redux/slices/appSettingsSlice';

//* services import
import {restartApp} from '@services/appServices/restartService';

//* utils import
import {loadDateFnsLocale} from '@utils/formateDate';

//* types import
import {Languages} from '@Types/languages';
import {AppDispatch} from '@Types/appDispatch';

//* languages import
import enTranslate from '@translation/en/index.json';
import arTranslate from '@translation/ar/index.json';

const resources = {
  en: {
    translation: enTranslate,
  },
  ar: {
    translation: arTranslate,
  },
};

// Helper function to normalize language codes
const normalizeLanguageCode = (languageCode: string): Languages => {
  const primaryTag = languageCode.split('-')[0].toLowerCase();

  // Check if the primary tag is supported
  if (primaryTag === 'ar' || primaryTag === 'en') {
    return primaryTag as Languages;
  }

  // Default to English for unsupported languages
  return 'en';
};

// Helper function to get device language
const getDeviceLanguage = (): Languages => {
  try {
    const deviceLocales = RNLocalize.getLocales();
    if (deviceLocales.length > 0) {
      return normalizeLanguageCode(deviceLocales[0].languageCode);
    }
  } catch (error) {
    console.log('Error getting device language:', error);
  }
  return 'en'; // Fallback to English
};

export const initLanguage = (lang: Languages) => {
  // Check if i18next is already initialized
  if (!i18next.isInitialized) {
    const languageToUse = lang ?? getDeviceLanguage();

    i18next
      .use(initReactI18next)
      .init({
        resources,
        lng: languageToUse, // Use normalized language code
        debug: true,
        fallbackLng: 'en', // Fallback language if detected language is not available
        interpolation: {
          escapeValue: false, // React already escapes values
        },
      })
      .then(() => {
        // Set up RTL support for Arabic
        checkAppDirection(languageToUse);
      })
      .catch(error => {
        console.log('Error initializing i18next:', error);
      })
      .finally(() => {
        loadDateFnsLocale();
      });
  }
};

// Function to change the language
export const changeLanguage = async (dispatch: AppDispatch) => {
  // Get current language and normalize it
  const currentLanguage = normalizeLanguageCode(i18next.language);
  const newLang: Languages = currentLanguage === 'ar' ? 'en' : 'ar';

  try {
    await dispatch(addLanguage(newLang)).then(async res => {
      if (res.meta.requestStatus === 'fulfilled') {
        await i18next
          .changeLanguage(newLang)
          .then(() => {
            checkAppDirection(newLang);
          })
          .catch(error => {
            console.log('Error i18n Language =>', error);
          })
          .finally(() => {
            loadDateFnsLocale();
          });
      }
    });
  } catch (error) {
    console.log('Error i18n changeLanguage: =>', error);
  }
};

// Function to check the app direction
export const checkAppDirection = async (currentLang: Languages) => {
  try {
    const shouldBeRTL = currentLang === 'ar';
    const isCurrentlyRTL = I18nManager.isRTL;

    // Only change RTL if it's different from current state
    if (shouldBeRTL !== isCurrentlyRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
      // Only restart if RTL actually changed
      delay(restartApp, 1000);
    }
  } catch (error) {
    console.log('Error in checkAppDirection:', error);
  }
};

export default i18next;
