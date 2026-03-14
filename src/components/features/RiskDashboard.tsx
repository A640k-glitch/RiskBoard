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
    if (portfolioError) toast.error(portfolioError.message);
  }, [portfolioError]);

  useEffect(() => {
    if (!portfolioLoading && !portfolioError && assets.length === 0) {
      const timeout = setTimeout(() => setIsInputOpen(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [portfolioLoading, portfolioError, assets.length]);

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
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <SkeletonCard className="h-24" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <SkeletonCard className="lg:col-span-4 h-[260px]" />
          <SkeletonCard className="lg:col-span-8 h-[260px]" />
        </div>
      </div>
    );
  }

  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(1).find(x => x.type === 'currency')?.value || '$';

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase leading-none">
            Intelligence_<span className="text-[var(--accent)] opacity-80">Stream</span>
          </h1>
          <p className="text-[8px] text-[var(--text-muted)] mt-1 font-black uppercase tracking-[0.3em]">Protocol_v3.2 // LIVE_METRICS</p>
        </div>
        <button
          onClick={() => setIsInputOpen(true)}
          className="bg-[var(--text-primary)] text-[var(--bg-base)] px-4 py-2 rounded font-black text-[9px] uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-3 h-3" /> Add_Position
        </button>
      </div>

      {metrics ? (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Total Value" value={convert(metrics.totalValue).toFixed(2)} prefix={currencySymbol} />
            <MetricCard label="Total P&L" value={Math.abs(convert(metrics.totalPnL)).toFixed(2)} prefix={metrics.totalPnL.greaterThanOrEqualTo(0) ? `+${currencySymbol}` : `-${currencySymbol}`} delta={metrics.pnlPercent.toFixed(2)} />
            <MetricCard label="Sharpe Ratio" value={metrics.sharpeRatio.toFixed(2)} />
            <MetricCard label="Max Drawdown" value={`${metrics.maxDrawdown.toFixed(2)}%`} />
          </div>

          {/* Risk Badge */}
          <RiskBadge level={metrics.riskLevel} score={metrics.riskScore} verdict={metrics.riskVerdict} />

          {/* Charts — grow to fill available space */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
            <div className="lg:col-span-4 apple-card p-2 flex flex-col min-h-[220px] lg:min-h-0">
              <AllocationChart assets={liveAssets} />
            </div>
            <div className="lg:col-span-8 apple-card p-2 flex flex-col min-h-[220px] lg:min-h-0">
              <VolatilityChart history={history} />
            </div>
          </div>
        </>
      ) : (
        <div className="apple-card p-8 text-center border-dashed border-2 flex-1 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Assets Yet</h3>
          <p className="text-[var(--text-muted)] mb-6 text-sm">Add your first asset to see your risk analytics.</p>
          <button
            onClick={() => setIsInputOpen(true)}
            className="bg-[var(--text-primary)] text-[var(--bg-base)] px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      )}

      {/* Assets Table */}
      {liveAssets.length > 0 && (
        <div className="apple-card overflow-hidden">
          <div className="flex items-center justify-between gap-2 py-2 px-4 sm:px-6 border-b border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="w-[100px] sm:w-[140px] text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Asset_Class</div>
            <div className="flex flex-1 justify-between items-center gap-2 sm:gap-4">
              <div className="w-[60px] sm:w-[100px] text-[8px] font-black text-[var(--text-muted)] text-right uppercase tracking-widest">Qty</div>
              <div className="w-[80px] sm:w-[100px] text-[8px] font-black text-[var(--text-muted)] text-right hidden sm:block uppercase tracking-widest">Price</div>
              <div className="w-[70px] sm:w-[100px] text-[8px] font-black text-[var(--text-muted)] text-right uppercase tracking-widest">Value</div>
              <div className="w-[70px] sm:w-[100px] text-[8px] font-black text-[var(--text-muted)] text-right uppercase tracking-widest">P&L</div>
            </div>
            <div className="w-6 sm:w-8"></div>
          </div>
          <div className="py-1 flex flex-col">
            {liveAssets.map(asset => (
              <AssetRow key={asset.id} asset={asset} onRemove={handleRemoveAsset} />
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
