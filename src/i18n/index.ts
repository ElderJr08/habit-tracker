import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en';
import pt from './pt';

function getDeviceLanguage(): 'en' | 'pt' {
  try {
    const code = Localization.getLocales()[0]?.languageCode ?? 'en';
    return code.startsWith('pt') ? 'pt' : 'en';
  } catch {
    return 'en';
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export type SupportedLanguage = 'en' | 'pt';
export default i18n;
