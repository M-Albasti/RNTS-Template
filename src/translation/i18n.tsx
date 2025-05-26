//* packages import
import {I18nManager} from 'react-native';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {delay, isEmpty} from 'lodash';

//* redux import
import {addLanguage} from '@redux/slices/appSettingsSlice';

//* services import
import {restartApp} from '@services/appServices/restartService';

//* types import
import {Languages} from '@Types/languages';
import {AppDispatch} from '@Types/appDispatch';

//* languages import
import enTranslate from './en/index.json';
import arTranslate from './ar/index.json';

const resources = {
  en: {
    translation: enTranslate,
  },
  ar: {
    translation: arTranslate,
  },
};

export const initLanguage = (lang: Languages) => {
  if (!i18next.isInitialized && isEmpty(i18next.isInitialized)) {
    i18next.use(initReactI18next).init({
      resources,
      lng: lang ?? RNLocalize.getLocales()[0].languageCode, // Automatically detect the device language
      debug: true,
      fallbackLng: 'en', // Fallback language if detected language is not available
      interpolation: {
        escapeValue: false, // React already escapes values
      },
    });
  }
};

// Function to change the language
export const changeLanguage = async (dispatch: AppDispatch) => {
  const newLang: Languages =
    (i18next.language as Languages) === 'ar' ? 'en' : 'ar';
  try {
    await dispatch(addLanguage(newLang)).then(async res => {
      if (res.meta.requestStatus === 'fulfilled') {
        await i18next
          .changeLanguage(newLang)
          .then(() => {
            I18nManager.forceRTL(newLang === 'ar');
            I18nManager.allowRTL(newLang === 'ar');
            delay(restartApp, 1000);
          })
          .catch(error => {
            console.log('Error i18n Language =>', error);
          });
      }
    });
  } catch (error) {
    console.log('Error i18n changeLanguage: =>', error);
  }
};

export default i18next;
