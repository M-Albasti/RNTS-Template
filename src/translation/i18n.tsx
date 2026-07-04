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

const normalizeLanguageCode = (languageCode: string): Languages => {
  const primaryTag = languageCode.split('-')[0].toLowerCase();

  if (primaryTag === 'ar' || primaryTag === 'en') {
    return primaryTag as Languages;
  }

  return 'en';
};

const getDeviceLanguage = (): Languages => {
  try {
    const deviceLocales = RNLocalize.getLocales();
    if (deviceLocales.length > 0) {
      return normalizeLanguageCode(deviceLocales[0].languageCode);
    }
  } catch (error) {
    console.log('Error getting device language:', error);
  }
  return 'en';
};

const bootstrapI18n = () => {
  if (i18next.isInitialized) {
    return;
  }

  i18next.use(initReactI18next).init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    debug: __DEV__,
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
    react: {
      // React Native should not suspend on translations — avoids hook/remount issues.
      useSuspense: false,
    },
    initImmediate: false,
  });

  loadDateFnsLocale();
};

bootstrapI18n();

/** Sync i18n with Redux language after navigation is ready or when settings change. */
export const syncLanguage = (lang?: Languages) => {
  const languageToUse = lang ?? normalizeLanguageCode(i18next.language) ?? getDeviceLanguage();

  if (i18next.language !== languageToUse) {
    i18next.changeLanguage(languageToUse).catch(error => {
      console.log('Error changing i18n language:', error);
    });
  }

  checkAppDirection(languageToUse);
  loadDateFnsLocale();
};

/** @deprecated Use `syncLanguage` */
export const initLanguage = syncLanguage;

export const changeLanguage = async (dispatch: AppDispatch) => {
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

export const checkAppDirection = async (currentLang: Languages) => {
  try {
    const shouldBeRTL = currentLang === 'ar';
    const isCurrentlyRTL = I18nManager.isRTL;

    if (shouldBeRTL !== isCurrentlyRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
      delay(restartApp, 1000);
    }
  } catch (error) {
    console.log('Error in checkAppDirection:', error);
  }
};

export default i18next;
