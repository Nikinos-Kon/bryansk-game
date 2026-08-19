import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('bryansk_currency') || 'RUB';
  });

  const RUB_TO_USD_RATE = 0.0125; // 1 RUB = 0.0125 USD (80 RUB per USD)

  useEffect(() => {
    localStorage.setItem('bryansk_currency', currency);
  }, [currency]);

  const switchCurrency = (newCurrency) => {
    if (['RUB', 'USD'].includes(newCurrency)) {
      setCurrency(newCurrency);
    }
  };

  const formatPrice = (priceRub, priceUsd) => {
    if (priceRub === 0 || priceUsd === 0) {
      return 'Бесплатно';
    }

    if (currency === 'USD') {
      const val = priceUsd !== undefined ? priceUsd : Number((priceRub * RUB_TO_USD_RATE).toFixed(2));
      return `$${val.toFixed(2)}`;
    }

    // Default RUB
    const val = priceRub !== undefined ? priceRub : Math.round(priceUsd / RUB_TO_USD_RATE);
    return `${Math.round(val).toLocaleString('ru-RU')} ₽`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, switchCurrency, formatPrice, RUB_TO_USD_RATE }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
