import { useState, useEffect } from 'react';
import type { Portfolio, Asset } from '../types';
import { useAuth } from './useAuth';
import Decimal from 'decimal.js';

const FREE_LIMITS = {
  portfolios: 1,
  assetsPerPortfolio: 5,
} as const;

export class FreeTierLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FreeTierLimitError";
  }
}

function storageKey(uid: string) {
  return `riskboard_portfolio_${uid}`;
}

function loadPortfolio(uid: string): Portfolio {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        assets: parsed.assets.map((a: any) => ({
          ...a,
          quantity: new Decimal(a.quantity),
          buyPrice: new Decimal(a.buyPrice),
          currentPrice: new Decimal(a.currentPrice || 0),
        })),
      };
    }
  } catch (_) {}
  return { id: 'local', userId: uid, name: 'My Portfolio', assets: [], createdAt: Date.now(), updatedAt: Date.now() };
}

function savePortfolio(portfolio: Portfolio) {
  const serializable = {
    ...portfolio,
    assets: portfolio.assets.map(a => ({
      ...a,
      quantity: a.quantity.toString(),
      buyPrice: a.buyPrice.toString(),
      currentPrice: a.currentPrice.toString(),
    })),
  };
  localStorage.setItem(storageKey(portfolio.userId), JSON.stringify(serializable));
}

export function usePortfolio() {
  const { user, loading: authLoading } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setPortfolios([]);
      setLoading(false);
      return;
    }
    const portfolio = loadPortfolio(user.uid);
    setPortfolios([portfolio]);
    setLoading(false);
  }, [user, authLoading]);

  const handleAddAsset = async (portfolioId: string, asset: Omit<Asset, 'id'>) => {
    if (!user) return;
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) throw new Error("Portfolio not found");
    if (portfolio.assets.length >= FREE_LIMITS.assetsPerPortfolio) {
      throw new FreeTierLimitError(`Free tier limit reached. You can only add up to ${FREE_LIMITS.assetsPerPortfolio} assets.`);
    }
    const newAsset: Asset = { ...asset, id: `${Date.now()}_${Math.random().toString(36).slice(2)}` };
    const updated = { ...portfolio, assets: [...portfolio.assets, newAsset], updatedAt: Date.now() };
    savePortfolio(updated);
    setPortfolios([updated]);
  };

  const handleRemoveAsset = async (portfolioId: string, assetId: string) => {
    if (!user) return;
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) return;
    const updated = { ...portfolio, assets: portfolio.assets.filter(a => a.id !== assetId), updatedAt: Date.now() };
    savePortfolio(updated);
    setPortfolios([updated]);
  };

  const handleUpdateAsset = async (portfolioId: string, assetId: string, updates: Partial<Asset>) => {
    if (!user) return;
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) return;
    const updated = { ...portfolio, assets: portfolio.assets.map(a => a.id === assetId ? { ...a, ...updates } : a), updatedAt: Date.now() };
    savePortfolio(updated);
    setPortfolios([updated]);
  };

  return {
    portfolios,
    loading,
    error,
    addAsset: handleAddAsset,
    removeAsset: handleRemoveAsset,
    updateAsset: handleUpdateAsset,
    refresh: () => {
      if (user) setPortfolios([loadPortfolio(user.uid)]);
    }
  };
}
