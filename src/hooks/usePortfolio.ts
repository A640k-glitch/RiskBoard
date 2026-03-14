import { useState, useEffect, useCallback } from 'react';
import { getPortfolios, createPortfolio, addAsset, removeAsset, updateAsset } from '../lib/firestore';
import type { Portfolio, Asset } from '../types';
import { useAuth } from './useAuth';

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

export function usePortfolio() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPortfolios = useCallback(async () => {
    if (!user) {
      setPortfolios([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getPortfolios(user.uid);
      if (data.length === 0) {
        const id = await createPortfolio(user.uid, "My Portfolio");
        setPortfolios([{ id, userId: user.uid, name: "My Portfolio", assets: [], createdAt: Date.now(), updatedAt: Date.now() }]);
      } else {
        setPortfolios(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to fetch portfolios"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleAddAsset = async (portfolioId: string, asset: Omit<Asset, 'id'>) => {
    if (!user) return;
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) throw new Error("Portfolio not found");
    
    if (portfolio.assets.length >= FREE_LIMITS.assetsPerPortfolio) {
      throw new FreeTierLimitError(`Free tier limit reached. You can only add up to ${FREE_LIMITS.assetsPerPortfolio} assets per portfolio.`);
    }

    await addAsset(user.uid, portfolioId, asset);
    await fetchPortfolios();
  };

  const handleRemoveAsset = async (portfolioId: string, assetId: string) => {
    if (!user) return;
    await removeAsset(user.uid, portfolioId, assetId);
    await fetchPortfolios();
  };

  const handleUpdateAsset = async (portfolioId: string, assetId: string, updates: Partial<Asset>) => {
    if (!user) return;
    await updateAsset(user.uid, portfolioId, assetId, updates);
    await fetchPortfolios();
  };

  return {
    portfolios,
    loading,
    error,
    addAsset: handleAddAsset,
    removeAsset: handleRemoveAsset,
    updateAsset: handleUpdateAsset,
    refresh: fetchPortfolios
  };
}
