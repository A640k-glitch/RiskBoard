import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface MetricCardProps {
  label: string; value: string; delta?: string; prefix?: string; suffix?: string; mono?: boolean; riskLevel?: 'safe' | 'moderate' | 'high';
}

export function MetricCard({ label, value, delta, prefix, suffix, mono = true, riskLevel }: MetricCardProps) {
  const isPositive = delta && !delta.startsWith('-');
  const isNegative = delta && delta.startsWith('-');

  return (
    <div className={cn(
      "apple-card p-2.5 sm:p-3 flex flex-col justify-between border",
      riskLevel === 'safe' && "border-t-[var(--accent)] border-t-2",
      riskLevel === 'moderate' && "border-t-[var(--warning)] border-t-2",
      riskLevel === 'high' && "border-t-[var(--danger)] border-t-2"
    )}>
      <div className="flex items-start justify-between gap-1">
        <span className="text-[var(--text-muted)] text-[9px] sm:text-[10px] uppercase font-black tracking-widest leading-tight">{label}</span>
        {delta && (
          <div className={cn(
            "flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0",
            isPositive ? "bg-[var(--success)]/10 text-[var(--success)]" :
            isNegative ? "bg-[var(--danger)]/10 text-[var(--danger)]" :
            "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
          )}>
            {isPositive ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : isNegative ? <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" /> : null}
            <span>{delta.replace('-', '')}%</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1 flex-wrap">
        {prefix && <span className="text-[var(--text-muted)] text-xs sm:text-sm font-medium">{prefix}</span>}
        <span className={cn("text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight", mono ? "font-mono" : "font-sans uppercase")}>
          {value}
        </span>
        {suffix && <span className="text-[var(--text-muted)] text-[9px] font-medium">{suffix}</span>}
      </div>
    </div>
  );
}
