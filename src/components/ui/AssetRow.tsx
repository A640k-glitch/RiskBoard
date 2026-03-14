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
    <div className="flex items-center justify-between gap-2 py-3 px-4 hover:bg-[var(--bg-elevated)] transition-all duration-200 group rounded-xl border border-transparent hover:border-[var(--border)]">
      <div className="flex flex-col w-[100px] sm:w-[140px] shrink-0">
        <span className="font-sans font-bold text-[var(--text-primary)] text-xs sm:text-sm truncate">{asset.symbol.toUpperCase()}</span>
        <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-medium mt-0.5 truncate">{asset.assetClass}</span>
      </div>
      
      <div className="flex flex-1 justify-between items-center gap-2 sm:gap-4 overflow-hidden">
        <div className="flex flex-col items-end w-[60px] sm:w-[100px] shrink-0">
          <span className="font-mono text-[var(--text-primary)] text-[9px] sm:text-xs truncate">{asset.quantity.toString()}</span>
          <span className="text-[8px] text-[var(--text-muted)] mt-0.5 uppercase tracking-tighter">Qty</span>
        </div>
        
        <div className="flex flex-col items-end w-[80px] sm:w-[100px] shrink-0 hidden sm:flex">
          <span className="font-mono text-[var(--text-primary)] text-[9px] sm:text-xs truncate">{format(asset.currentPrice)}</span>
          <span className="text-[8px] text-[var(--text-muted)] mt-0.5 uppercase tracking-tighter">Price</span>
        </div>
        
        <div className="flex flex-col items-end w-[70px] sm:w-[100px] shrink-0">
          <span className="font-mono text-[var(--text-primary)] text-[9px] sm:text-xs font-bold truncate">{format(value)}</span>
          <span className="text-[8px] text-[var(--text-muted)] mt-0.5 uppercase tracking-tighter">Value</span>
        </div>
        
        <div className="flex flex-col items-end w-[70px] sm:w-[100px] shrink-0">
          <span className={`font-mono text-[9px] sm:text-xs font-bold truncate ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {isPositive ? '+' : ''}{format(pnl)}
          </span>
          <span className={`text-[8px] mt-0.5 font-bold uppercase tracking-tighter ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {isPositive ? '+' : ''}{pnlPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end w-6 sm:w-8 shrink-0">
        <button 
          onClick={() => onRemove(asset.id)}
          className="text-[var(--text-muted)] hover:text-[var(--danger)] rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity p-1.5"
          aria-label="Remove asset"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
