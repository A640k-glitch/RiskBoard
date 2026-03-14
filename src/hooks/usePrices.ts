import { useState, useEffect } from 'react';
import { fetchCurrentPrices, fetchPriceHistory } from '../lib/coingecko';
import type { Asset, PriceHistory } from '../types';
import Decimal from 'decimal.js';

export function usePrices(assets: Asset[]) {
  const [prices, setPrices] = useState<Record<string, Decimal>>({});
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const updateData = async () => {
      if (assets.length === 0) {
        if (mounted) {
          setPrices({});
          setHistory([]);
        }
        return;
      }

      setLoading(true);
      const symbols = assets.map(a => a.symbol);
      
      try {
        const newPrices = await fetchCurrentPrices(symbols);
        
        const newHistory: PriceHistory[] = [];
        for (const sym of symbols) {
          const hist = await fetchPriceHistory(sym);
          newHistory.push(hist);
        }

        if (mounted) {
          setPrices(newPrices);
          setHistory(newHistory);
        }
      } catch (e) {
        console.error("Error updating prices", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    updateData();

    const interval = setInterval(updateData, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [assets.map(a => a.symbol).join(',')]);

  return { prices, history, loading };
}
