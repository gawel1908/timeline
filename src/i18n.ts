// src/i18n.ts
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'react-native-localize';

const currentLocale = Localization.getLocales()?.[0]?.languageCode || 'en';

const resources = {
  en: {
    translation: require('./locales/en.json'),
  },
  pl: {
    translation: require('./locales/pl.json'),
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: currentLocale,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
