'use client';
import { useState, useEffect, useCallback } from 'react';

type Language = 'ja' | 'en';

const STORAGE_KEY = 'language';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('ja');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === 'ja' || stored === 'en') {
      setLanguageState(stored);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  return {
    language,
    setLanguage,
    isLoaded,
  };
}
