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
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-8 py-8 px-10 hover:bg-[var(--bg-elevated)]/50 transition-all duration-500 group rounded-3xl mx-2 my-3 border border-transparent hover:border-[var(--border)]/50 hover:shadow-lg">
      <div className="flex flex-col min-w-[140px]">
        <span className="font-sans font-light text-[var(--text-primary)] text-3xl tracking-widest">{asset.symbol.toUpperCase()}</span>
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] font-medium mt-2 opacity-70">{asset.assetClass}</span>
      </div>
      
      <div className="flex flex-1 justify-between items-center gap-8">
        <div className="flex flex-col items-end min-w-[100px]">
          <span className="font-mono text-[var(--text-primary)] text-lg font-light tracking-wider">{asset.quantity.toString()}</span>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] mt-2 opacity-60">Qty</span>
        </div>
        
        <div className="flex flex-col items-end min-w-[100px] hidden sm:flex">
          <span className="font-mono text-[var(--text-primary)] text-lg font-light tracking-wider">{format(asset.currentPrice)}</span>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] mt-2 opacity-60">Price</span>
        </div>
        
        <div className="flex flex-col items-end min-w-[120px]">
          <span className="font-mono text-[var(--text-primary)] text-lg font-light tracking-wider">{format(value)}</span>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] mt-2 opacity-60">Value</span>
        </div>
        
        <div className="flex flex-col items-end min-w-[120px]">
          <span className={`font-mono text-lg font-light tracking-wider ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {isPositive ? '+' : ''}{format(pnl)}
          </span>
          <span className={`text-[10px] font-medium px-3 py-1.5 rounded-full mt-3 tracking-[0.2em] border ${isPositive ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' : 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20'}`}>
            {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end w-12">
        <button 
          onClick={() => onRemove(asset.id)}
          className="text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-full md:opacity-0 group-hover:opacity-100 transition-all duration-300 p-3"
          aria-label="Remove asset"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
