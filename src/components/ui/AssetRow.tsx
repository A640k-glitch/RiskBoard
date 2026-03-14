import React from 'react';
import type { Asset } from '../../types';
import Decimal from 'decimal.js';
import { Trash2 } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

export function AssetRow({ asset, onRemove }: { asset: Asset; onRemove: (id: string) => void }) {
  const { format } = useCurrency();
  const value = asset.quantity.times(asset.currentPrice);
  const cost = asset.quantity.times(asset.buyPrice);
  const pnl = value.minus(cost);
  const pnlPercent = cost.isZero() ? new Decimal(0) : pnl.dividedBy(cost).times(100);
  const isPositive = pnl.greaterThanOrEqualTo(0);

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-4 sm:gap-x-6 py-3 px-4 sm:px-6 hover:bg-[var(--bg-elevated)] transition-colors group border-b border-[var(--border)]/40 last:border-0">
      <div className="min-w-0">
        <div className="font-sans font-bold text-[var(--text-primary)] text-sm sm:text-base truncate">{asset.symbol.toUpperCase()}</div>
        <div className="text-xs text-[var(--text-muted)] font-medium truncate mt-0.5">{asset.assetClass}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-[var(--text-primary)] text-xs sm:text-sm">{asset.quantity.toString()}</div>
        <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-tight">Qty</div>
      </div>
      <div className="text-right hidden sm:block">
        <div className="font-mono text-[var(--text-primary)] text-xs sm:text-sm">{format(asset.currentPrice)}</div>
        <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-tight">Price</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-[var(--text-primary)] text-xs sm:text-sm font-bold">{format(value)}</div>
        <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-tight">Value</div>
      </div>
      <div className="text-right hidden sm:block">
        <div className={`font-mono text-xs sm:text-sm font-bold ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
          {isPositive ? '+' : ''}{format(pnl)}
        </div>
        <div className={`text-[9px] font-bold uppercase tracking-tight ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
          {isPositive ? '+' : ''}{pnlPercent.toFixed(1)}%
        </div>
      </div>
      <div className="col-span-full sm:col-auto flex justify-end sm:justify-center pt-1 sm:pt-0">
        <button onClick={() => onRemove(asset.id)}
          className="text-[var(--text-muted)] hover:text-[var(--danger)] sm:opacity-0 sm:group-hover:opacity-100 transition-all p-1.5 rounded"
          aria-label="Remove asset">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
