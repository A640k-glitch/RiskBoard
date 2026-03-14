import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { PriceHistory } from '../../types';
import Decimal from 'decimal.js';

interface VolatilityChartProps { history: PriceHistory[]; }

export function VolatilityChart({ history }: VolatilityChartProps) {
  if (history.length === 0 || history[0].prices.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] font-sans font-light text-sm">No price history available</div>;
  }

  const numDays = history[0].prices.length;
  const data = [];
  for (let i = 0; i < numDays; i++) {
    let dailyTotal = new Decimal(0);
    const dateStr = history[0].prices[i].date;
    const date = new Date(dateStr);
    const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
    for (const assetHistory of history) {
      if (assetHistory.prices[i]) dailyTotal = dailyTotal.plus(assetHistory.prices[i].price);
    }
    data.push({ date: formattedDate, value: dailyTotal.toNumber() });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-1">
      <h3 className="text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase tracking-widest shrink-0">Trend</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 300, opacity: 0.8 }} minTickGap={40} dy={10} />
            <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 300, opacity: 0.8 }} tickFormatter={(val) => `$${val.toFixed(0)}`} domain={['auto', 'auto']} dx={10} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-primary)', padding: '12px 16px', border: '1px solid var(--border)' }}
              itemStyle={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: '13px' }}
              labelStyle={{ color: 'var(--text-muted)', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Index Value']}
            />
            <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 5, fill: 'var(--bg-surface)', stroke: 'var(--accent)', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
