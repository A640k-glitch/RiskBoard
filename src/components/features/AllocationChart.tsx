import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Asset } from '../../types';

interface AllocationChartProps {
  assets: Asset[];
}

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function AllocationChart({ assets }: AllocationChartProps) {
  const data = assets.map(asset => ({
    name: asset.symbol.toUpperCase(),
    value: asset.quantity.times(asset.currentPrice).toNumber()
  })).filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-[var(--text-muted)] font-sans font-light">
        No allocation data
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full flex flex-col p-4">
      <h3 className="text-[10px] font-medium text-[var(--text-muted)] mb-8 uppercase tracking-[0.3em] font-sans opacity-70">Asset Allocation</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={6}
              dataKey="value"
              animationDuration={1500}
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ 
                backgroundColor: 'var(--bg-surface)', 
                borderColor: 'var(--border)', 
                borderRadius: '20px', 
                color: 'var(--text-primary)', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '16px 20px',
                border: '1px solid var(--border)'
              }}
              itemStyle={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: '14px' }}
            />
            <Legend verticalAlign="bottom" height={50} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', opacity: 0.8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
