import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { PriceHistory } from '../../types';
import Decimal from 'decimal.js';

interface VolatilityChartProps { history: PriceHistory[]; }

export function VolatilityChart({ history }: VolatilityChartProps) {
  if (history.length === 0 || history[0].prices.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
        No price history available
      </div>
    );
  }

  const numDays = history[0].prices.length;
  const data = [];
  for (let i = 0; i < numDays; i++) {
    let dailyTotal = new Decimal(0);
    const date = new Date(history[0].prices[i].date);
    const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
    for (const h of history) {
      if (h.prices[i]) dailyTotal = dailyTotal.plus(h.prices[i].price);
    }
    data.push({ date: label, value: dailyTotal.toNumber() });
  }

  return (
    <div className="w-full h-full flex flex-col p-2">
      <p className="text-xs font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest shrink-0">Trend</p>
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, opacity: 0.8 }}
              minTickGap={40} dy={8} />
            <YAxis orientation="right" axisLine={false} tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, opacity: 0.8 }}
              tickFormatter={(v) => `$${v.toFixed(0)}`} domain={['auto','auto']} dx={8} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '10px', color: 'var(--text-primary)', padding: '10px 14px', border: '1px solid var(--border)', fontSize: '12px' }}
              itemStyle={{ color: 'var(--accent)' }}
              labelStyle={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, 'Index Value']}
            />
            <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2}
              fillOpacity={1} fill="url(#colorValue)"
              activeDot={{ r: 4, fill: 'var(--bg-surface)', stroke: 'var(--accent)', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
