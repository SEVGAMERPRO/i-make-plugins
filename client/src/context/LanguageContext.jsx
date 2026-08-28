import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

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
    statusUpdated: 'Status updated successfully'
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
    statusUpdated: 'Status succesvol bijgewerkt'
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
    statusUpdated: 'Status erfolgreich aktualisiert'
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
    statusUpdated: 'Statut mis à jour'
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
    statusUpdated: 'Estado actualizado'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('minoforge_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('minoforge_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: Object.keys(TRANSLATIONS) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
