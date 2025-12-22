import { useState, useEffect } from 'react';
import { Language } from '../types/language';

interface Translations {
  [key: string]: any;
}

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        const translationModule = await import(`../locales/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English if translation fails
        if (language !== 'en') {
          const fallbackModule = await import('../locales/en.json');
          setTranslations(fallbackModule.default);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations;
    
    for (const k of keys) {
      current = current?.[k];
      if (!current) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return current || key;
  };

  return {
    language,
    setLanguage,
    t,
    loading
  };
};