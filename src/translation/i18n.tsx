// i18n.js
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import enTranslate from './en/index.json';
import arTranslate from './ar/index.json';
import {Languages} from '@Types/languages';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {I18nManager} from 'react-native';
import {addLanguage} from '@redux/slices/appSettingsSlice';
import {AppDispatch} from '@Types/appDispatch';

const resources = {
  en: {
    translation: enTranslate,
  },
  ar: {
    translation: arTranslate,
  },
};

export const initLanguage = (lang: Languages) => {
  i18next.use(initReactI18next).init({
    resources,
    lng: lang ?? RNLocalize.getLocales()[0].languageTag, // Automatically detect the device language
    debug: true,
    fallbackLng: 'en', // Fallback language if detected language is not available
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });
};

// Function to change the language
export const changeLanguage = (lang: Languages, dispatch: AppDispatch) => {
  i18next
    .changeLanguage(lang)
    .then(() => {
      dispatch(addLanguage(lang));
      I18nManager.forceRTL(lang == 'ar');
      I18nManager.allowRTL(lang == 'ar');
      RNRestart.restart();
    })
    .catch(error => {
      console.log('Error i18n Language =>', error);
    });
};

export default i18next;
