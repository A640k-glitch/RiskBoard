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
      "apple-card p-3 sm:p-4 flex flex-col justify-between border",
      riskLevel === 'safe' && "border-t-[var(--accent)] border-t-2",
      riskLevel === 'moderate' && "border-t-[var(--warning)] border-t-2",
      riskLevel === 'high' && "border-t-[var(--danger)] border-t-2"
    )}>
      <div className="flex items-start justify-between gap-1">
        <span className="text-[var(--text-muted)] text-[10px] sm:text-xs uppercase font-black tracking-widest leading-tight">{label}</span>
        {delta && (
          <div className={cn(
            "flex items-center text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded shrink-0",
            isPositive ? "bg-[var(--success)]/10 text-[var(--success)]" :
            isNegative ? "bg-[var(--danger)]/10 text-[var(--danger)]" :
            "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : isNegative ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : null}
            <span>{delta.replace('-', '')}%</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1 flex-wrap">
        {prefix && <span className="text-[var(--text-muted)] text-sm sm:text-base font-medium">{prefix}</span>}
        <span className={cn("text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-none", mono ? "font-mono" : "font-sans uppercase")}>
          {value}
        </span>
        {suffix && <span className="text-[var(--text-muted)] text-xs font-medium">{suffix}</span>}
      </div>
    </div>
  );
}
