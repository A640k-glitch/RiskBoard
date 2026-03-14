import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import Decimal from 'decimal.js';
import type { AssetClass } from '../../types';
import { resolveSymbolToId } from '../../lib/coingecko';
import { useCurrency } from '../../hooks/useCurrency';

interface PortfolioInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: { symbol: string; name: string; assetClass: AssetClass; quantity: Decimal; buyPrice: Decimal; currentPrice: Decimal; addedAt: number }) => Promise<void>;
}

const POPULAR_ASSETS: Record<AssetClass, { symbol: string; name: string }[]> = {
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'XRP', name: 'Ripple' },
    { symbol: 'DOGE', name: 'Dogecoin' },
    { symbol: 'DOT', name: 'Polkadot' },
  ],
  stock: [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Alphabet' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'META', name: 'Meta' },
    { symbol: 'NVDA', name: 'NVIDIA' },
  ],
  etf: [
    { symbol: 'SPY', name: 'SPDR S&P 500' },
    { symbol: 'QQQ', name: 'Invesco QQQ' },
    { symbol: 'VTI', name: 'Vanguard Total Stock' },
    { symbol: 'ARKK', name: 'ARK Innovation' },
  ],
  forex: [
    { symbol: 'EURUSD', name: 'EUR/USD' },
    { symbol: 'GBPUSD', name: 'GBP/USD' },
    { symbol: 'USDJPY', name: 'USD/JPY' },
  ],
  commodity: [
    { symbol: 'GLD', name: 'Gold' },
    { symbol: 'SLV', name: 'Silver' },
    { symbol: 'USO', name: 'Oil' },
  ],
  cash: [
    { symbol: 'USD', name: 'US Dollar' },
    { symbol: 'EUR', name: 'Euro' },
    { symbol: 'GBP', name: 'British Pound' },
  ]
};

export function PortfolioInput({ isOpen, onClose, onSubmit }: PortfolioInputProps) {
  const [symbol, setSymbol] = useState('');
  const [assetClass, setAssetClass] = useState<AssetClass>('crypto');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidSymbol, setIsValidSymbol] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSymbolBlur = async () => {
    if (!symbol) return;
    // Delay validation slightly to allow dropdown clicks to register
    setTimeout(async () => {
      setIsValidating(true);
      setIsValidSymbol(null);
      if (assetClass === 'crypto') {
        const id = await resolveSymbolToId(symbol);
        setIsValidSymbol(id !== null);
      } else {
        setIsValidSymbol(true);
      }
      setIsValidating(false);
    }, 200);
  };

  const handleSelectAsset = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setShowDropdown(false);
    setIsValidSymbol(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!symbol || !quantity || !buyPrice) {
      setError('Please fill all fields');
      return;
    }

    if (isValidSymbol === false) {
      setError('Invalid symbol');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        assetClass,
        quantity: new Decimal(quantity),
        buyPrice: new Decimal(buyPrice),
        currentPrice: new Decimal(buyPrice),
        addedAt: Date.now()
      });
      setSymbol('');
      setQuantity('');
      setBuyPrice('');
      setIsValidSymbol(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAssets = POPULAR_ASSETS[assetClass]?.filter(a => 
    a.symbol.toLowerCase().includes(symbol.toLowerCase()) || 
    a.name.toLowerCase().includes(symbol.toLowerCase())
  ) || [];

  const { currency } = useCurrency();

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--bg-surface)] border-l border-[var(--border)] z-50 p-6 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-sans text-[var(--text-muted)] text-[10px] mb-1 font-black uppercase tracking-widest">Add Position</p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-sans tracking-tight">NEW ASSET</h2>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-elevated)] p-2 rounded-full hover:bg-[var(--border)] shadow-sm">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none">Asset Class</label>
            <div className="relative">
              <select
                value={assetClass}
                onChange={(e) => {
                  setAssetClass(e.target.value as AssetClass);
                  setSymbol('');
                  setIsValidSymbol(null);
                }}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none font-bold text-xs shadow-sm uppercase tracking-widest"
              >
                <option value="crypto">Cryptocurrency</option>
                <option value="stock">Stock</option>
                <option value="etf">ETF</option>
                <option value="forex">Forex</option>
                <option value="commodity">Commodity</option>
                <option value="cash">Cash</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2" ref={dropdownRef}>
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none">Symbol</label>
            <div className="relative">
              <input
                type="text"
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value.toUpperCase());
                  setShowDropdown(true);
                  setIsValidSymbol(null);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={handleSymbolBlur}
                placeholder={assetClass === 'crypto' ? 'e.g. BTC' : 'e.g. AAPL'}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors font-mono uppercase text-sm shadow-sm font-bold"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isValidating && <div className="w-3 h-3 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />}
                {isValidSymbol === true && <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />}
                {isValidSymbol === false && <AlertCircle className="w-4 h-4 text-[var(--danger)]" />}
                <ChevronDown 
                  className={`w-4 h-4 text-[var(--text-muted)] cursor-pointer transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  onClick={() => setShowDropdown(!showDropdown)}
                />
              </div>

              {showDropdown && filteredAssets.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-lg max-h-48 overflow-y-auto backdrop-blur-md">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.symbol}
                      onClick={() => handleSelectAsset(asset.symbol)}
                      className="px-5 py-4 hover:bg-[var(--bg-surface)] cursor-pointer flex items-center justify-between border-b border-[var(--border)] last:border-0 transition-colors"
                    >
                      <span className="font-mono font-bold text-[var(--text-primary)]">{asset.symbol}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none">Quantity</label>
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors font-mono text-sm shadow-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none">Average Buy Price ({currency})</label>
            <input
              type="number"
              step="any"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors font-mono text-sm shadow-sm"
            />
          </div>

          {error && (
            <div className="bg-[var(--danger)]/10 text-[var(--danger)] p-3 rounded-lg text-sm flex items-start gap-2 border border-[var(--danger)]/20 shadow-sm mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="font-medium text-xs">{error}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <button
              type="submit"
              disabled={isSubmitting || isValidSymbol === false}
              className="w-full bg-[var(--text-primary)] text-[var(--bg-base)] font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
            >
              {isSubmitting ? 'Adding...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
