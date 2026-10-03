import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
  lng: 'pt',
  fallbackLng: 'en',
  resources: {
    en: { translation: {} },
    pt: { translation: {} },
  },
  interpolation: { escapeValue: false },
});

export default i18next;
