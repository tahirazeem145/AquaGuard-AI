import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { TRANSLATIONS, INDIAN_LANGUAGES } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('aquaguard_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    try {
      localStorage.setItem('aquaguard_language', langCode);
    } catch (e) {
      console.warn('Failed to save language to localStorage', e);
    }
  };

  // Helper translation function with fallback to English
  const t = useMemo(() => {
    return (key, params = {}) => {
      const fallback = typeof params === 'string' ? params : key;
      const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = langDict?.[key] || TRANSLATIONS.en?.[key] || fallback;

      if (params && typeof params === 'object') {
        Object.keys(params).forEach((paramKey) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
        });
      }
      return text;
    };
  }, [language]);

  // Translate disease condition names
  const translateDisease = (condition) => {
    if (!condition) return t('disease_healthy');
    const c = condition.toLowerCase();
    if (c.includes('healthy')) return t('disease_healthy');
    if (c.includes('gill')) return t('disease_gill');
    if (c.includes('red') || c.includes('ulcer') || c.includes('eus')) return t('disease_red_spot');
    if (c.includes('dropsy') || c.includes('aero')) return t('disease_dropsy');
    if (c.includes('sapro') || c.includes('fungal')) return t('disease_fungal');
    if (c.includes('parasit') || c.includes('ich') || c.includes('white spot')) return t('disease_parasites');
    if (c.includes('tail') || c.includes('fin') || c.includes('viral')) return t('disease_fin_rot');
    return condition;
  };

  // Translate treatment categories
  const translateCategory = (cat) => {
    switch (cat) {
      case 'Emergency Life Support':
        return t('category_emergency');
      case 'Water Remediation':
        return t('category_clean_water');
      case 'Alkalinity Buffer':
        return t('category_ph');
      case 'Therapeutic Saline Bath':
        return t('category_salt_bath');
      case 'Anti-Fungal Bath':
        return t('category_fungus');
      case 'Osmotic Relief':
        return t('category_epsom');
      case 'Pond Biosecurity':
        return t('category_biosecurity');
      case 'Epithelial Support':
        return t('category_fin_care');
      case 'Thermal & Flow Control':
        return t('category_flow');
      case 'Preventative Maintenance':
        return t('category_routine');
      default:
        return cat || t('category_routine');
    }
  };

  // Translate severity tier badges
  const translateTier = (tier, isShort = false) => {
    switch (tier) {
      case 'NORMAL':
        return isShort ? t('tier_safe_short') : t('tier_normal');
      case 'ADVISORY':
        return isShort ? t('tier_watch_short') : t('tier_advisory');
      case 'WARNING':
        return isShort ? t('tier_warning_short') : t('tier_warning');
      case 'EMERGENCY':
        return isShort ? t('tier_danger_short') : t('tier_emergency');
      default:
        return tier;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateDisease,
        translateCategory,
        translateTier,
        languages: INDIAN_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback if outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key) => TRANSLATIONS.en[key] || key,
      translateDisease: (d) => d,
      translateCategory: (c) => c,
      translateTier: (tier) => tier,
      languages: INDIAN_LANGUAGES
    };
  }
  return context;
}

