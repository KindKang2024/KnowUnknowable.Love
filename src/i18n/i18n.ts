import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

import en from './locales/en.json';
import zh from './locales/zh.json';
import zhHK from './locales/zh-HK.json';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(resourcesToBackend((language, namespace) => {
    return import(`./locales/${language}.json`);
  }))
  
  .init({
    partialBundledLanguages: true,
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      },
      'zh-HK': {
        translation: zhHK
      }
    },
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['cookie', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
      cookieOptions: { path: '/', sameSite: 'strict' }
    },
    debug: true, // 启用调试信息
    react: {
      useSuspense: false
    }
  })
  .then(() => {
    console.log('loaded locales:', Object.keys(i18n.services.resourceStore.data));
  });

export default i18n;