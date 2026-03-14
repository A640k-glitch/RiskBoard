import Decimal from 'decimal.js';

export type AssetClass = 'crypto' | 'stock' | 'etf' | 'forex' | 'commodity' | 'cash';
export type RiskLevel = 'safe' | 'moderate' | 'high';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  quantity: Decimal;
  buyPrice: Decimal;
  currentPrice: Decimal;
  addedAt: number;
};

export type Portfolio = {
  id: string;
  userId: string;
  name: string;
  assets: Asset[];
  createdAt: number;
  updatedAt: number;
};

export type RiskMetrics = {
  totalValue: Decimal;
  totalPnL: Decimal;
  pnlPercent: Decimal;
  sharpeRatio: Decimal;
  maxDrawdown: Decimal;
  volatility: Decimal;
  concentrationRisk: Decimal;
  riskScore: number;
  riskLevel: RiskLevel;
  riskVerdict: string;
  topRiskFlag: string;
};

export type PriceHistory = {
  symbol: string;
  prices: { date: string; price: Decimal }[];
};
