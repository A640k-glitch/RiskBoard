import React from 'react';
import type { Asset } from '../../types';
import Decimal from 'decimal.js';
import { Trash2 } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

interface AssetRowProps {
  asset: Asset;
  onRemove: (id: string) => void;
}

export function AssetRow({ asset, onRemove }: AssetRowProps) {
  const { convert, format } = useCurrency();
  const value = asset.quantity.times(asset.currentPrice);
  const cost = asset.quantity.times(asset.buyPrice);
  const pnl = value.minus(cost);
  const pnlPercent = cost.isZero() ? new Decimal(0) : pnl.dividedBy(cost).times(100);
  const isPositive = pnl.greaterThanOrEqualTo(0);

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-3 sm:gap-x-4 py-2.5 px-3 sm:px-5 hover:bg-[var(--bg-elevated)] transition-colors group border-b border-[var(--border)]/40 last:border-0">
      {/* Asset name + class */}
      <div className="min-w-0">
        <div className="font-sans font-bold text-[var(--text-primary)] text-xs sm:text-sm truncate">{asset.symbol.toUpperCase()}</div>
        <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-medium truncate">{asset.assetClass}</div>
      </div>

      {/* Qty */}
      <div className="text-right">
        <div className="font-mono text-[var(--text-primary)] text-[10px] sm:text-xs">{asset.quantity.toString()}</div>
        <div className="text-[8px] text-[var(--text-muted)] uppercase tracking-tighter">Qty</div>
      </div>

      {/* Price — hidden on mobile */}
      <div className="text-right hidden sm:block">
        <div className="font-mono text-[var(--text-primary)] text-[10px] sm:text-xs">{format(asset.currentPrice)}</div>
        <div className="text-[8px] text-[var(--text-muted)] uppercase tracking-tighter">Price</div>
      </div>

      {/* Value */}
      <div className="text-right">
        <div className="font-mono text-[var(--text-primary)] text-[10px] sm:text-xs font-bold">{format(value)}</div>
        <div className="text-[8px] text-[var(--text-muted)] uppercase tracking-tighter">Value</div>
      </div>

      {/* P&L — hidden on mobile, shown on sm+ */}
      <div className="text-right hidden sm:block">
        <div className={`font-mono text-[10px] sm:text-xs font-bold ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
          {isPositive ? '+' : ''}{format(pnl)}
        </div>
        <div className={`text-[8px] font-bold uppercase tracking-tighter ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
          {isPositive ? '+' : ''}{pnlPercent.toFixed(1)}%
        </div>
      </div>

      {/* Delete — always visible on mobile, hover-reveal on desktop */}
      <div className="col-span-full sm:col-auto flex justify-end sm:justify-center pt-1 sm:pt-0">
        <button
          onClick={() => onRemove(asset.id)}
          className="text-[var(--text-muted)] hover:text-[var(--danger)] sm:opacity-0 sm:group-hover:opacity-100 transition-all p-1.5 rounded"
          aria-label="Remove asset"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
