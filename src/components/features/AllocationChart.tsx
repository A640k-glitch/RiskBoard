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
    return <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] font-sans font-light text-sm">No allocation data</div>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-1">
      <h3 className="text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase tracking-widest shrink-0">Allocation</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius="55%" outerRadius="75%" paddingAngle={6} dataKey="value" animationDuration={1500} stroke="none" cornerRadius={6}>
              {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-primary)', padding: '12px 16px', border: '1px solid var(--border)' }}
              itemStyle={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: '13px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
