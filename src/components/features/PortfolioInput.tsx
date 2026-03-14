import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import Decimal from 'decimal.js';
import type { AssetClass } from '../../types';
import { resolveSymbolToId } from '../../lib/coingecko';

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

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border)] z-50 p-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="font-mono text-[var(--accent)] text-xs mb-2 uppercase tracking-[0.3em]">// Add_Position</p>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] font-sans tracking-tight">New Asset</h2>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-elevated)] p-3 rounded-full hover:bg-[var(--border)] shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-1">
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans opacity-70">Asset Class</label>
            <div className="relative">
              <select
                value={assetClass}
                onChange={(e) => {
                  setAssetClass(e.target.value as AssetClass);
                  setSymbol('');
                  setIsValidSymbol(null);
                }}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl px-6 py-5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all appearance-none font-sans text-lg shadow-sm hover:border-[var(--text-muted)]"
              >
                <option value="crypto">Cryptocurrency</option>
                <option value="stock">Stock</option>
                <option value="etf">ETF</option>
                <option value="forex">Forex</option>
                <option value="commodity">Commodity</option>
                <option value="cash">Cash</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-4" ref={dropdownRef}>
            <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans opacity-70">Symbol</label>
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
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl px-6 py-5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all font-mono uppercase text-lg shadow-sm hover:border-[var(--text-muted)]"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                {isValidating && <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />}
                {isValidSymbol === true && <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />}
                {isValidSymbol === false && <AlertCircle className="w-5 h-5 text-[var(--danger)]" />}
                <ChevronDown 
                  className={`w-5 h-5 text-[var(--text-muted)] cursor-pointer transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  onClick={() => setShowDropdown(!showDropdown)}
                />
              </div>

              {showDropdown && filteredAssets.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.symbol}
                      onClick={() => handleSelectAsset(asset.symbol)}
                      className="px-5 py-4 hover:bg-[var(--bg-surface)] cursor-pointer flex items-center justify-between border-b border-[var(--border)] last:border-0 transition-colors"
                    >
                      <span className="font-mono font-bold text-[var(--text-primary)]">{asset.symbol}</span>
                      <span className="text-sm text-[var(--text-muted)] font-sans">{asset.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans opacity-70">Quantity</label>
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl px-6 py-5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all font-mono text-lg shadow-sm hover:border-[var(--text-muted)]"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans opacity-70">Average Buy Price (USD)</label>
            <input
              type="number"
              step="any"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl px-6 py-5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all font-mono text-lg shadow-sm hover:border-[var(--text-muted)]"
            />
          </div>

          {error && (
            <div className="bg-[var(--danger)]/10 text-[var(--danger)] p-5 rounded-2xl text-sm flex items-start gap-3 border border-[var(--danger)]/20 shadow-sm">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="mt-auto pt-10 border-t border-[var(--border)]">
            <button
              type="submit"
              disabled={isSubmitting || isValidSymbol === false}
              className="w-full bg-[var(--accent)] text-[var(--bg-base)] font-bold py-5 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {isSubmitting ? 'Adding...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
