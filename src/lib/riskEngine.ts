import Decimal from 'decimal.js';
import type { Asset, RiskMetrics, PriceHistory, RiskLevel } from '../types';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

const RISK_FREE_RATE = new Decimal('0.045');
const TRADING_DAYS = new Decimal('252');

export function calcTotalValue(assets: Asset[]): Decimal {
  return assets.reduce((sum, asset) => sum.plus(asset.quantity.times(asset.currentPrice)), new Decimal(0));
}

export function calcPnL(assets: Asset[]): { totalPnL: Decimal; pnlPercent: Decimal } {
  let totalCost = new Decimal(0);
  let totalValue = new Decimal(0);

  assets.forEach(asset => {
    totalCost = totalCost.plus(asset.quantity.times(asset.buyPrice));
    totalValue = totalValue.plus(asset.quantity.times(asset.currentPrice));
  });

  const totalPnL = totalValue.minus(totalCost);
  const pnlPercent = totalCost.isZero() ? new Decimal(0) : totalPnL.dividedBy(totalCost).times(100);

  return { totalPnL, pnlPercent };
}

export function calcVolatility(history: PriceHistory[]): Decimal {
  if (history.length === 0 || history[0].prices.length < 2) return new Decimal(0);

  let totalVol = new Decimal(0);
  let validAssets = 0;

  for (const assetHistory of history) {
    const prices = assetHistory.prices.map(p => p.price);
    if (prices.length < 2) continue;

    const returns: Decimal[] = [];
    for (let i = 1; i < prices.length; i++) {
      const prev = prices[i - 1];
      const curr = prices[i];
      if (!prev.isZero()) {
        returns.push(curr.minus(prev).dividedBy(prev));
      } else {
        returns.push(new Decimal(0));
      }
    }

    if (returns.length === 0) continue;

    const meanReturn = returns.reduce((sum, r) => sum.plus(r), new Decimal(0)).dividedBy(returns.length);
    const variance = returns.reduce((sum, r) => sum.plus(r.minus(meanReturn).pow(2)), new Decimal(0)).dividedBy(returns.length);
    const stdDev = variance.sqrt();
    const annualisedVol = stdDev.times(TRADING_DAYS.sqrt());
    
    totalVol = totalVol.plus(annualisedVol);
    validAssets++;
  }

  return validAssets > 0 ? totalVol.dividedBy(validAssets) : new Decimal(0);
}

export function calcSharpeRatio(annualisedReturn: Decimal, volatility: Decimal): Decimal {
  if (volatility.isZero()) return new Decimal(0);
  return annualisedReturn.minus(RISK_FREE_RATE).dividedBy(volatility);
}

export function calcMaxDrawdown(history: PriceHistory[]): Decimal {
  if (history.length === 0 || history[0].prices.length === 0) return new Decimal(0);
  
  let totalDrawdown = new Decimal(0);
  let validAssets = 0;

  for (const assetHistory of history) {
    let peak = new Decimal(0);
    let maxDd = new Decimal(0);

    for (const p of assetHistory.prices) {
      if (p.price.greaterThan(peak)) {
        peak = p.price;
      }
      if (!peak.isZero()) {
        const dd = peak.minus(p.price).dividedBy(peak);
        if (dd.greaterThan(maxDd)) {
          maxDd = dd;
        }
      }
    }
    totalDrawdown = totalDrawdown.plus(maxDd);
    validAssets++;
  }

  return validAssets > 0 ? totalDrawdown.dividedBy(validAssets).times(100) : new Decimal(0);
}

export function calcConcentrationRisk(assets: Asset[], totalValue: Decimal): Decimal {
  if (totalValue.isZero() || assets.length === 0) return new Decimal(0);
  
  let maxAssetValue = new Decimal(0);
  for (const asset of assets) {
    const value = asset.quantity.times(asset.currentPrice);
    if (value.greaterThan(maxAssetValue)) {
      maxAssetValue = value;
    }
  }

  return maxAssetValue.dividedBy(totalValue).times(100);
}

export function calcRiskScore(metrics: Omit<RiskMetrics, 'riskScore' | 'riskLevel' | 'riskVerdict' | 'topRiskFlag'>): number {
  const volScore = Decimal.min(metrics.volatility.times(100), new Decimal(100)).toNumber();
  const ddScore = Decimal.min(metrics.maxDrawdown, new Decimal(100)).toNumber();
  const concScore = Decimal.min(metrics.concentrationRisk, new Decimal(100)).toNumber();
  
  let sharpeScore = 0;
  const sharpe = metrics.sharpeRatio.toNumber();
  if (sharpe <= 0) sharpeScore = 100;
  else if (sharpe >= 2) sharpeScore = 0;
  else sharpeScore = 100 - (sharpe / 2) * 100;

  const score = (volScore * 0.30) + (ddScore * 0.25) + (concScore * 0.25) + (sharpeScore * 0.20);
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 39) return 'safe';
  if (score <= 69) return 'moderate';
  return 'high';
}

export function getRiskVerdict(metrics: RiskMetrics, assets: Asset[]): string {
  if (assets.length === 0) return "Add assets to see your risk verdict.";
  
  const topAsset = assets.reduce((prev, current) => 
    (prev.quantity.times(prev.currentPrice).greaterThan(current.quantity.times(current.currentPrice))) ? prev : current
  );
  const topAssetConc = metrics.concentrationRisk.toFixed(0);

  if (metrics.riskLevel === 'safe') {
    return `Your portfolio is well-diversified. Biggest position is ${topAsset.symbol} at ${topAssetConc}% — within safe range.`;
  } else if (metrics.riskLevel === 'moderate') {
    return `Moderate risk. High ${topAsset.symbol} concentration at ${topAssetConc}% is your main exposure.`;
  } else {
    return `High risk. Highly concentrated portfolio with significant drawdown history. Consider spreading your investments.`;
  }
}

export function getTopRiskFlag(metrics: RiskMetrics, assets: Asset[]): string {
  if (assets.length === 0) return "No assets";
  
  const topAsset = assets.reduce((prev, current) => 
    (prev.quantity.times(prev.currentPrice).greaterThan(current.quantity.times(current.currentPrice))) ? prev : current
  );

  if (metrics.concentrationRisk.greaterThan(50)) {
    return `${topAsset.symbol} concentration at ${metrics.concentrationRisk.toFixed(0)}%`;
  }
  if (metrics.volatility.greaterThan(0.8)) {
    return `Extreme volatility (${metrics.volatility.times(100).toFixed(0)}% annualized)`;
  }
  if (metrics.sharpeRatio.lessThan(0)) {
    return `Negative risk-adjusted returns (Sharpe < 0)`;
  }
  if (metrics.maxDrawdown.greaterThan(40)) {
    return `Historical drawdown of ${metrics.maxDrawdown.toFixed(0)}%`;
  }
  
  return "Well balanced";
}

export function calculateRiskMetrics(assets: Asset[], history: PriceHistory[]): RiskMetrics {
  const totalValue = calcTotalValue(assets);
  const { totalPnL, pnlPercent } = calcPnL(assets);
  const volatility = calcVolatility(history);
  
  const annualisedReturn = pnlPercent.dividedBy(100); 
  
  const sharpeRatio = calcSharpeRatio(annualisedReturn, volatility);
  const maxDrawdown = calcMaxDrawdown(history);
  const concentrationRisk = calcConcentrationRisk(assets, totalValue);

  const baseMetrics = {
    totalValue,
    totalPnL,
    pnlPercent,
    sharpeRatio,
    maxDrawdown,
    volatility,
    concentrationRisk
  };

  const riskScore = calcRiskScore(baseMetrics);
  const riskLevel = getRiskLevel(riskScore);
  
  const metricsWithScore = { ...baseMetrics, riskScore, riskLevel } as RiskMetrics;
  
  const riskVerdict = getRiskVerdict(metricsWithScore, assets);
  const topRiskFlag = getTopRiskFlag(metricsWithScore, assets);

  return {
    ...metricsWithScore,
    riskVerdict,
    topRiskFlag
  };
}
