import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// 60+ World Languages supported by Google Multi-Language Translator, sorted ALPHABETICALLY (A-Z) by English Name
export const ALL_LANGUAGES = [
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan dili', flag: '🇦🇿' },
  { code: 'eu', name: 'Basque', native: 'Euskara', flag: '🇪🇸' },
  { code: 'be', name: 'Belarusian', native: 'Беларуская', flag: '🇧🇾' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski', flag: '🇧🇦' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬' },
  { code: 'ca', name: 'Catalan', native: 'Català', flag: '🇪🇸' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文', flag: '🇹🇼' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪' },
  { code: 'tl', name: 'Filipino / Tagalog', native: 'Tagalog', flag: '🇵🇭' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'gl', name: 'Galician', native: 'Galego', flag: '🇪🇸' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақ тілі', flag: '🇰🇿' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
  { code: 'fa', name: 'Persian / Farsi', native: 'فارسی', flag: '🇮🇷' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Portuguese (Brazil)', native: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', native: 'Português (Portugal)', flag: '🇵🇹' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' }
].sort((a, b) => a.name.localeCompare(b.name));

export const TRANSLATIONS = {
  en: {
    marketplace: 'Marketplace',
    bounties: 'Bounties',
    configGenerator: 'Config Generator',
    creatorHub: 'Creator Hub',
    logIn: 'Log In',
    register: 'Create Account',
    searchPlaceholder: 'Search plugins, scripts, configs...',
    goUltimate: 'Go Ultimate',
    heroTitle: 'Find the best plugins for your favorite games',
    heroSubtitle: 'Thousands of verified game plugins, server configs, scripts, and custom commissions.',
    featuredPlugins: 'Featured Plugins',
    categories: 'Game Categories',
    allPlugins: 'All Plugins',
    free: 'Free',
    rating: 'Rating',
    downloads: 'Downloads',
    price: 'Price',
    author: 'Author',
    settings: 'Settings',
    language: 'Language',
    security: 'Security & 2FA',
    profile: 'Profile',
    selectLanguage: 'Select Your Preferred Language',
    saveLanguage: 'Save Language Preference',
    crashAnalyzer: 'AI Error & Crash Log Analyzer',
    readmeWriter: 'AI Readme & Docs Generator',
    canvaDesigner: 'Design on Canva with AI',
    statusUpdated: 'Status updated successfully',
    googleTranslatePowered: 'Powered by Google Cloud Multi-Language Translator',
    searchLanguage: 'Search 60+ languages alphabetically...',
    resetLanguage: 'Reset to Default (English)'
  },
  nl: {
    marketplace: 'Marktplaats',
    bounties: 'Opdrachten',
    configGenerator: 'Config Generator',
    creatorHub: 'Maker Portaal',
    logIn: 'Inloggen',
    register: 'Account Aanmaken',
    searchPlaceholder: 'Zoek plugins, scripts, configs...',
    goUltimate: 'Word Ultimate',
    heroTitle: 'Vind de beste plugins voor jouw favoriete games',
    heroSubtitle: 'Duizenden geverifieerde game-plugins, serverconfiguraties, scripts en maatwerkopdrachten.',
    featuredPlugins: 'Uitgelichte Plugins',
    categories: 'Spelcategorieën',
    allPlugins: 'Alle Plugins',
    free: 'Gratis',
    rating: 'Beoordeling',
    downloads: 'Downloads',
    price: 'Prijs',
    author: 'Auteur',
    settings: 'Instellingen',
    language: 'Taal',
    security: 'Beveiliging & 2FA',
    profile: 'Profiel',
    selectLanguage: 'Kies jouw voorkeurstaal',
    saveLanguage: 'Taalvoorkeur Opslaan',
    crashAnalyzer: 'AI Fout & Crashlog Analyse',
    readmeWriter: 'AI Documentatie & Readme Schrijver',
    canvaDesigner: 'Ontwerp op Canva met AI',
    statusUpdated: 'Status succesvol bijgewerkt',
    googleTranslatePowered: 'Aangedreven door Google Cloud Meertalige Vertaler',
    searchLanguage: 'Zoek in 60+ talen op alfabetische volgorde...',
    resetLanguage: 'Standaardtaal herstellen'
  },
  de: {
    marketplace: 'Marktplatz',
    bounties: 'Aufträge',
    configGenerator: 'Konfig-Generator',
    creatorHub: 'Entwickler-Hub',
    logIn: 'Anmelden',
    register: 'Konto Erstellen',
    searchPlaceholder: 'Plugins, Skripte, Konfigurationen suchen...',
    goUltimate: 'Ultimate Werden',
    heroTitle: 'Finde die besten Plugins für deine Lieblingsspiele',
    heroSubtitle: 'Tausende verifizierte Plugins, Serverkonfigurationen und Skripte.',
    featuredPlugins: 'Empfohlene Plugins',
    categories: 'Spielkategorien',
    allPlugins: 'Alle Plugins',
    free: 'Kostenlos',
    rating: 'Bewertung',
    downloads: 'Downloads',
    price: 'Preis',
    author: 'Autor',
    settings: 'Einstellungen',
    language: 'Sprache',
    security: 'Sicherheit & 2FA',
    profile: 'Profil',
    selectLanguage: 'Wähle deine bevorzugte Sprache',
    saveLanguage: 'Spracheinstellung Speichern',
    crashAnalyzer: 'AI Fehler- & Crashlog-Analyse',
    readmeWriter: 'AI Dokumentations-Generator',
    canvaDesigner: 'Mit AI auf Canva erstellen',
    statusUpdated: 'Status erfolgreich aktualisiert',
    googleTranslatePowered: 'Bereitgestellt durch Google Cloud Multi-Language Translator',
    searchLanguage: '60+ Sprachen alphabetisch durchsuchen...',
    resetLanguage: 'Auf Standard zurücksetzen'
  },
  fr: {
    marketplace: 'Boutique',
    bounties: 'Missions',
    configGenerator: 'Générateur de Config',
    creatorHub: 'Espace Créateur',
    logIn: 'Connexion',
    register: 'Créer un Compte',
    searchPlaceholder: 'Rechercher des plugins, scripts...',
    goUltimate: 'Passer Ultimate',
    heroTitle: 'Trouvez les meilleurs plugins pour vos jeux préférés',
    heroSubtitle: 'Des milliers de plugins vérifiés, configurations et scripts de jeu.',
    featuredPlugins: 'Plugins en Vedette',
    categories: 'Catégories de Jeux',
    allPlugins: 'Tous les Plugins',
    free: 'Gratuit',
    rating: 'Note',
    downloads: 'Téléchargements',
    price: 'Prix',
    author: 'Auteur',
    settings: 'Paramètres',
    language: 'Langue',
    security: 'Sécurité & 2FA',
    profile: 'Profil',
    selectLanguage: 'Sélectionnez votre langue',
    saveLanguage: 'Enregistrer la langue',
    crashAnalyzer: 'Analyseur de Crash & Logs IA',
    readmeWriter: 'Générateur de Readme IA',
    canvaDesigner: 'Concevoir sur Canva avec IA',
    statusUpdated: 'Statut mis à jour',
    googleTranslatePowered: 'Propulsé par Google Cloud Multi-Language Translator',
    searchLanguage: 'Rechercher plus de 60 langues par ordre alphabétique...',
    resetLanguage: 'Réinitialiser par défaut'
  },
  es: {
    marketplace: 'Mercado',
    bounties: 'Encargos',
    configGenerator: 'Generador de Configuración',
    creatorHub: 'Portal de Creadores',
    logIn: 'Iniciar Sesión',
    register: 'Crear Cuenta',
    searchPlaceholder: 'Buscar plugins, scripts, configs...',
    goUltimate: 'Hazte Ultimate',
    heroTitle: 'Encuentra los mejores plugins para tus juegos favoritos',
    heroSubtitle: 'Miles de plugins verificados, configuraciones y scripts de servidor.',
    featuredPlugins: 'Plugins Destacados',
    categories: 'Categorías de Juegos',
    allPlugins: 'Todos los Plugins',
    free: 'Gratis',
    rating: 'Calificación',
    downloads: 'Descargas',
    price: 'Precio',
    author: 'Autor',
    settings: 'Ajustes',
    language: 'Idioma',
    security: 'Seguridad y 2FA',
    profile: 'Perfil',
    selectLanguage: 'Selecciona tu idioma preferido',
    saveLanguage: 'Guardar Idioma',
    crashAnalyzer: 'Analizador de Errores y Logs IA',
    readmeWriter: 'Generador de Readme IA',
    canvaDesigner: 'Diseñar en Canva con IA',
    statusUpdated: 'Estado actualizado',
    googleTranslatePowered: 'Impulsado por Google Cloud Multi-Language Translator',
    searchLanguage: 'Buscar más de 60 idiomas por orden alfabético...',
    resetLanguage: 'Restablecer idioma por defecto'
  }
};

/**
 * Triggers Google Website Translator cookie and DOM update
 */
export const triggerGoogleTranslate = (langCode) => {
  try {
    const googleCode = langCode === 'en' ? '' : langCode;
    // Set standard Google translate cookies
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/auto/${googleCode}; path=/;`;
    if (hostname && hostname !== 'localhost') {
      document.cookie = `googtrans=/auto/${googleCode}; path=/; domain=.${hostname};`;
    }
    
    // Trigger the select dropdown if google translate element is mounted
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
    }
  } catch (err) {
    console.warn('Google Translate Trigger notice:', err);
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('minoforge_language') || 'en';
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem('minoforge_language', newLang);
    document.documentElement.lang = newLang;
    triggerGoogleTranslate(newLang);
  };

  useEffect(() => {
    localStorage.setItem('minoforge_language', language);
    document.documentElement.lang = language;
    triggerGoogleTranslate(language);
  }, [language]);

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const currentLanguageObj = ALL_LANGUAGES.find(l => l.code === language) || ALL_LANGUAGES.find(l => l.code === 'en');

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      languages: ALL_LANGUAGES,
      currentLanguageObj,
      availableLanguages: ALL_LANGUAGES.map(l => l.code) 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
