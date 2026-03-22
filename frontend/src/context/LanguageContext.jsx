import React, { createContext, useState, useContext } from 'react';
import frTranslations from '../locales/fr';
import enTranslations from '../locales/en';
import deTranslations from '../locales/de';
import esTranslations from '../locales/es';
import itTranslations from '../locales/it';
import jaTranslations from '../locales/ja';
import koTranslations from '../locales/ko';
import zhHansTranslations from '../locales/zh-hans';
import zhHantTranslations from '../locales/zh-hant';

const LanguageContext = createContext();

const allTranslations = {
  fr: frTranslations,
  en: enTranslations,
  de: deTranslations,
  es: esTranslations,
  it: itTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  'zh-hans': zhHansTranslations,
  'zh-hant': zhHantTranslations
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');
  const [currentPage, setCurrentPage] = useState('home');

  // Fonction pour charger les traductions d'une page spécifique
  const loadPageTranslations = (page) => {
    setCurrentPage(page);
  };

  // Fonction de traduction qui cherche d'abord dans les traductions de page, puis dans les traductions communes
  const t = (key) => {
    const lang = language;
    const translations = allTranslations[lang];
    
    // Cherche d'abord dans les traductions de la page courante, puis dans common
    if (translations[currentPage] && translations[currentPage][key]) {
      return translations[currentPage][key];
    }
    
    if (translations.common && translations.common[key]) {
      return translations.common[key];
    }
    
    return key;
  };

  const getTranslationForLanguage = (key, lang, page = 'common') => {
    const translations = allTranslations[lang] || allTranslations['en'];
    
    if (translations[page] && translations[page][key]) {
      return translations[page][key];
    }
    
    if (translations.common && translations.common[key]) {
      return translations.common[key];
    }
    
    return key;
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'fr' ? 'en' : 'fr'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, getTranslationForLanguage, loadPageTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
