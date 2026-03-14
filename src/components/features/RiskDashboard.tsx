import React, { useState, useMemo, useEffect } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { usePrices } from '../../hooks/usePrices';
import { useCurrency } from '../../hooks/useCurrency';
import { calculateRiskMetrics } from '../../lib/riskEngine';
import { MetricCard } from '../ui/MetricCard';
import { RiskBadge } from '../ui/RiskBadge';
import { AssetRow } from '../ui/AssetRow';
import { AllocationChart } from './AllocationChart';
import { VolatilityChart } from './VolatilityChart';
import { PortfolioInput } from './PortfolioInput';
import { SkeletonCard } from '../ui/SkeletonCard';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export function RiskDashboard() {
  const { portfolios, loading: portfolioLoading, addAsset, removeAsset, error: portfolioError } = usePortfolio();
  const portfolio = portfolios[0];
  const assets = portfolio?.assets || [];
  
  const { prices, history, loading: pricesLoading } = usePrices(assets);
  const { currency, convert } = useCurrency();
  const [isInputOpen, setIsInputOpen] = useState(false);

  const liveAssets = useMemo(() => {
    return assets.map(asset => ({
      ...asset,
      currentPrice: prices[asset.symbol] || asset.currentPrice
    }));
  }, [assets, prices]);

  const metrics = useMemo(() => {
    if (liveAssets.length === 0) return null;
    return calculateRiskMetrics(liveAssets, history);
  }, [liveAssets, history]);

  useEffect(() => {
    if (portfolioError) {
      toast.error(portfolioError.message);
    }
  }, [portfolioError]);

  const handleRemoveAsset = async (id: string) => {
    if (portfolio) {
      try {
        await removeAsset(portfolio.id, id);
        toast.success('Asset removed successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to remove asset');
      }
    }
  };

  if (portfolioLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard className="h-32" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <SkeletonCard className="lg:col-span-4 h-[300px]" />
          <SkeletonCard className="lg:col-span-8 h-[300px]" />
        </div>
      </div>
    );
  }

  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(1).find(x => x.type === 'currency')?.value || '$';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="font-mono text-[var(--accent)] text-sm mb-2 uppercase tracking-[0.3em] opacity-80">// Dashboard</p>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] font-sans tracking-tight">Portfolio Analytics</h1>
        </div>
        <button 
          onClick={() => setIsInputOpen(true)}
          className="bg-[var(--accent)] text-[var(--bg-base)] px-6 py-3 rounded-2xl text-base font-bold hover:opacity-90 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add Asset
        </button>
      </div>

      {metrics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              label="Total Value" 
              value={convert(metrics.totalValue).toFixed(2)} 
              prefix={currencySymbol} 
            />
            <MetricCard 
              label="Total P&L" 
              value={Math.abs(convert(metrics.totalPnL)).toFixed(2)} 
              prefix={metrics.totalPnL.greaterThanOrEqualTo(0) ? `+${currencySymbol}` : `-${currencySymbol}`} 
              delta={metrics.pnlPercent.toFixed(2)} 
            />
            <MetricCard 
              label="Sharpe Ratio" 
              value={metrics.sharpeRatio.toFixed(2)} 
            />
            <MetricCard 
              label="Max Drawdown" 
              value={`${metrics.maxDrawdown.toFixed(2)}%`} 
            />
          </div>

          <RiskBadge 
            level={metrics.riskLevel} 
            score={metrics.riskScore} 
            verdict={metrics.riskVerdict} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 apple-card p-10 flex flex-col">
              <AllocationChart assets={liveAssets} />
            </div>
            <div className="lg:col-span-8 apple-card p-10 flex flex-col">
              <VolatilityChart history={history} />
            </div>
          </div>
        </>
      ) : (
        <div className="apple-card p-12 text-center">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Assets Yet</h3>
          <p className="text-[var(--text-muted)] mb-6">Add your first asset to see your risk analytics.</p>
          <button 
            onClick={() => setIsInputOpen(true)}
            className="bg-[var(--accent)] text-[var(--bg-base)] px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
        </div>
      )}

      {liveAssets.length > 0 && (
        <div className="apple-card overflow-hidden">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-8 py-6 px-12 border-b border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="min-w-[140px] text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-70">Asset</div>
            <div className="flex flex-1 justify-between items-center gap-8">
              <div className="min-w-[100px] text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-70 text-right">Quantity</div>
              <div className="min-w-[100px] text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-70 text-right hidden sm:block">Price</div>
              <div className="min-w-[120px] text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-70 text-right">Value</div>
              <div className="min-w-[120px] text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-70 text-right">P&L</div>
            </div>
            <div className="w-12"></div>
          </div>
          <div className="py-4 flex flex-col gap-2">
            {liveAssets.map(asset => (
              <AssetRow 
                key={asset.id} 
                asset={asset} 
                onRemove={handleRemoveAsset} 
              />
            ))}
          </div>
        </div>
      )}

      <PortfolioInput 
        isOpen={isInputOpen} 
        onClose={() => setIsInputOpen(false)} 
        onSubmit={async (asset) => {
          try {
            if (portfolio) {
              await addAsset(portfolio.id, asset);
              toast.success('Asset added successfully');
            }
          } catch (e: any) {
            toast.error(e.message || 'Failed to add asset');
            throw e;
          }
        }} 
      />
    </div>
  );
}
