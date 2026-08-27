import React, { createContext, useContext, useState, useEffect } from 'react';

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.00, decimals: 2, prefix: true },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92, decimals: 2, prefix: false },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.79, decimals: 2, prefix: true },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.36, decimals: 2, prefix: true },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.52, decimals: 2, prefix: true },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', rate: 5.40, decimals: 2, prefix: true },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 155.0, decimals: 0, prefix: true },
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState(() => {
    try {
      const saved = localStorage.getItem('minoforge_currency');
      if (saved && CURRENCIES[saved]) return saved;
    } catch {}
    return 'USD'; // Default is USD
  });

  useEffect(() => {
    try {
      localStorage.setItem('minoforge_currency', currencyCode);
    } catch {}
  }, [currencyCode]);

  const activeCurrency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  // Format price helper (e.g. 4.99 -> "$4.99" or "€4.59" or "¥773" or "Free")
  const formatPrice = (amountInUSD, showCurrencyCode = false) => {
    const num = parseFloat(amountInUSD);
    if (isNaN(num) || num === 0) {
      return 'Free';
    }

    const converted = num * activeCurrency.rate;
    const formattedNum = activeCurrency.decimals === 0 
      ? Math.round(converted).toLocaleString()
      : converted.toFixed(activeCurrency.decimals);

    let result = '';
    if (activeCurrency.prefix) {
      result = `${activeCurrency.symbol}${formattedNum}`;
    } else {
      result = `${formattedNum}${activeCurrency.symbol}`;
    }

    if (showCurrencyCode) {
      result += ` ${activeCurrency.code}`;
    }

    return result;
  };

  // Convert raw numeric price
  const convertPrice = (amountInUSD) => {
    const num = parseFloat(amountInUSD);
    if (isNaN(num)) return 0;
    const converted = num * activeCurrency.rate;
    return activeCurrency.decimals === 0 ? Math.round(converted) : parseFloat(converted.toFixed(activeCurrency.decimals));
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: currencyCode,
        activeCurrency,
        setCurrency: setCurrencyCode,
        currencies: Object.values(CURRENCIES),
        formatPrice,
        convertPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
