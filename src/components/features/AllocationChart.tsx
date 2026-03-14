import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Asset } from '../../types';

interface AllocationChartProps { assets: Asset[]; }

const COLORS = ['var(--chart-1)','var(--chart-2)','var(--chart-3)','var(--chart-4)','var(--chart-5)'];

export function AllocationChart({ assets }: AllocationChartProps) {
  const data = assets.map(asset => ({
    name: asset.symbol.toUpperCase(),
    value: asset.quantity.times(asset.currentPrice).toNumber()
  })).filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
        No allocation data
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-2">
      <p className="text-xs font-black text-[var(--text-muted)] mb-2 uppercase tracking-widest shrink-0">Allocation</p>
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius="52%" outerRadius="72%"
              paddingAngle={5} dataKey="value" animationDuration={1200} stroke="none" cornerRadius={4}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '10px', color: 'var(--text-primary)', padding: '10px 14px', border: '1px solid var(--border)', fontSize: '12px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
