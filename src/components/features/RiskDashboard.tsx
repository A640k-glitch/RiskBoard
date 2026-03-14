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

  const { prices, history } = usePrices(assets);
  const { currency, convert } = useCurrency();
  const [isInputOpen, setIsInputOpen] = useState(false);

  const liveAssets = useMemo(() => assets.map(asset => ({
    ...asset, currentPrice: prices[asset.symbol] || asset.currentPrice
  })), [assets, prices]);

  const metrics = useMemo(() => {
    if (liveAssets.length === 0) return null;
    return calculateRiskMetrics(liveAssets, history);
  }, [liveAssets, history]);

  useEffect(() => { if (portfolioError) toast.error(portfolioError.message); }, [portfolioError]);

  useEffect(() => {
    if (!portfolioLoading && !portfolioError && assets.length === 0) {
      const t = setTimeout(() => setIsInputOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, [portfolioLoading, portfolioError, assets.length]);

  const handleRemoveAsset = async (id: string) => {
    if (!portfolio) return;
    try {
      await removeAsset(portfolio.id, id);
      toast.success('Asset removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove asset');
    }
  };

  if (portfolioLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-[240px]" />
      </div>
    );
  }

  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency })
    .formatToParts(1).find(x => x.type === 'currency')?.value || '$';

  return (
    <div className="space-y-3 w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase leading-none">
            Intelligence_<span className="text-[var(--accent)] opacity-80">Stream</span>
          </h1>
          <p className="text-[7px] sm:text-[8px] text-[var(--text-muted)] mt-1 font-black uppercase tracking-[0.3em]">Protocol_v3.2 // LIVE_METRICS</p>
        </div>
        <button
          onClick={() => setIsInputOpen(true)}
          className="self-start sm:self-auto bg-[var(--text-primary)] text-[var(--bg-base)] px-3 py-2 rounded font-black text-[9px] uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-3 h-3" /> Add_Position
        </button>
      </div>

      {metrics ? (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <MetricCard label="Total Value" value={convert(metrics.totalValue).toFixed(2)} prefix={currencySymbol} />
            <MetricCard label="Total P&L" value={Math.abs(convert(metrics.totalPnL)).toFixed(2)} prefix={metrics.totalPnL.greaterThanOrEqualTo(0) ? `+${currencySymbol}` : `-${currencySymbol}`} delta={metrics.pnlPercent.toFixed(2)} />
            <MetricCard label="Sharpe Ratio" value={metrics.sharpeRatio.toFixed(2)} />
            <MetricCard label="Max Drawdown" value={`${metrics.maxDrawdown.toFixed(2)}%`} />
          </div>

          {/* Risk Badge */}
          <RiskBadge level={metrics.riskLevel} score={metrics.riskScore} verdict={metrics.riskVerdict} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-4 apple-card p-2 h-[220px] sm:h-[260px]">
              <AllocationChart assets={liveAssets} />
            </div>
            <div className="lg:col-span-8 apple-card p-2 h-[220px] sm:h-[260px]">
              <VolatilityChart history={history} />
            </div>
          </div>
        </>
      ) : (
        <div className="apple-card p-10 text-center border-dashed border-2">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">No Assets Yet</h3>
          <p className="text-[var(--text-muted)] mb-6 text-sm">Add your first asset to see your risk analytics.</p>
          <button onClick={() => setIsInputOpen(true)} className="bg-[var(--text-primary)] text-[var(--bg-base)] px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      )}

      {/* Assets Table */}
      {liveAssets.length > 0 && (
        <div className="apple-card overflow-hidden">
          {/* Table header — matches AssetRow grid */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-3 sm:gap-x-4 py-2 px-3 sm:px-5 border-b border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Asset_Class</div>
            <div className="text-[8px] font-black text-[var(--text-muted)] text-right uppercase tracking-widest">Qty</div>
            <div className="text-[8px] font-black text-[var(--text-muted)] text-right uppercase tracking-widest hidden sm:block">Price</div>
            <div className="text-[8px] font-black text-[var(--text-muted)] text-right uppercase tracking-widest">Value</div>
            <div className="text-[8px] font-black text-[var(--text-muted)] text-right uppercase tracking-widest hidden sm:block">P&L</div>
          </div>
          <div>
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
