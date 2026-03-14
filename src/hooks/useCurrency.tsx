import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

const API_KEY = '33fbd4d60e4c5ee458b7fe6c';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  rates: Record<string, number>;
  convert: (amount: number | string | { toNumber: () => number }, targetCurrency?: string) => number;
  format: (amount: number | string | { toNumber: () => number }, targetCurrency?: string) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });

  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setRates(data.conversion_rates);
        }
      })
      .catch(console.error);
  }, []);

  const convert = (amount: any, targetCurrency: string = currency) => {
    const rate = rates[targetCurrency] || 1;
    const val = typeof amount === 'number' ? amount : typeof amount === 'string' ? parseFloat(amount) : amount.toNumber();
    return val * rate;
  };

  const format = (amount: any, targetCurrency: string = currency) => {
    const converted = convert(amount, targetCurrency);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
