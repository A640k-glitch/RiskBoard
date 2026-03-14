import Decimal from 'decimal.js';
import type { PriceHistory } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

let lastCallTime = 0;
const CALL_DELAY_MS = 2100;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  if (timeSinceLastCall < CALL_DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, CALL_DELAY_MS - timeSinceLastCall));
  }
  lastCallTime = Date.now();
  return fetch(url);
}

const SYMBOL_MAP: Record<string, string> = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'bnb': 'binancecoin',
  'sol': 'solana',
  'usdt': 'tether',
  'ada': 'cardano',
  'doge': 'dogecoin',
  'matic': 'matic-network',
  'xrp': 'ripple',
  'dot': 'polkadot',
};

export async function resolveSymbolToId(symbol: string): Promise<string | null> {
  const lowerSymbol = symbol.toLowerCase();
  if (SYMBOL_MAP[lowerSymbol]) return SYMBOL_MAP[lowerSymbol];
  
  try {
    const res = await rateLimitedFetch(`${BASE_URL}/search?query=${lowerSymbol}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.coins && data.coins.length > 0) {
      return data.coins[0].id;
    }
  } catch (e) {
    console.error("Failed to resolve symbol", e);
  }
  return null;
}

export async function fetchCurrentPrices(symbols: string[]): Promise<Record<string, Decimal>> {
  const ids: string[] = [];
  const idToSymbol: Record<string, string> = {};

  for (const sym of symbols) {
    const id = await resolveSymbolToId(sym);
    if (id) {
      ids.push(id);
      idToSymbol[id] = sym;
    }
  }

  if (ids.length === 0) return {};

  try {
    const res = await rateLimitedFetch(`${BASE_URL}/simple/price?ids=${ids.join(',')}&vs_currencies=usd`);
    if (!res.ok) return {};
    const data = await res.json();
    
    const result: Record<string, Decimal> = {};
    for (const id of ids) {
      if (data[id] && data[id].usd) {
        result[idToSymbol[id]] = new Decimal(data[id].usd);
      }
    }
    return result;
  } catch (e) {
    console.error("Failed to fetch current prices", e);
    return {};
  }
}

export async function fetchPriceHistory(symbol: string): Promise<PriceHistory> {
  const id = await resolveSymbolToId(symbol);
  if (!id) return { symbol, prices: [] };

  try {
    const res = await rateLimitedFetch(`${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`);
    if (!res.ok) return { symbol, prices: [] };
    const data = await res.json();
    
    const prices = data.prices.map((p: [number, number]) => ({
      date: new Date(p[0]).toISOString(),
      price: new Decimal(p[1])
    }));

    return { symbol, prices };
  } catch (e) {
    console.error("Failed to fetch price history", e);
    return { symbol, prices: [] };
  }
}
