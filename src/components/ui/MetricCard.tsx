import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  prefix?: string;
  suffix?: string;
  mono?: boolean;
  riskLevel?: 'safe' | 'moderate' | 'high';
}

export function MetricCard({ label, value, delta, prefix, suffix, mono = true, riskLevel }: MetricCardProps) {
  const isPositive = delta && !delta.startsWith('-');
  const isNegative = delta && delta.startsWith('-');

  return (
    <div className={cn(
      "apple-card p-14 flex flex-col gap-10 min-h-[320px] justify-between transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)] border border-[var(--border)]/50 rounded-3xl",
      riskLevel === 'safe' && "border-t-[var(--accent)] border-t-2",
      riskLevel === 'moderate' && "border-t-[var(--warning)] border-t-2",
      riskLevel === 'high' && "border-t-[var(--danger)] border-t-2"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-elevated)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative z-10 flex items-start justify-between">
        <span className="text-[var(--text-muted)] text-[10px] font-medium uppercase tracking-[0.3em] font-sans opacity-70">{label}</span>
        {delta && (
          <div className={cn(
            "flex items-center text-[10px] font-medium px-4 py-2 rounded-full w-fit backdrop-blur-md shadow-sm border tracking-widest",
            isPositive ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20" : 
            isNegative ? "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20" : 
            "bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)]"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1.5" /> : isNegative ? <ArrowDownRight className="w-3 h-3 mr-1.5" /> : null}
            <span>{delta.replace('-', '')}%</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10 mt-auto">
        <div className="flex items-baseline gap-2">
          {prefix && <span className="text-[var(--text-muted)] text-xs font-medium opacity-60">{prefix}</span>}
          <span className={cn("text-2xl text-[var(--text-primary)] tracking-widest", mono ? "font-mono font-light" : "font-sans font-light")}>
            {value}
          </span>
          {suffix && <span className="text-[var(--text-muted)] text-xs font-medium opacity-60">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
