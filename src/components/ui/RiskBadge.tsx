import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RiskLevel } from '../../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RiskBadgeProps {
  level: RiskLevel;
  score: number;
  verdict: string;
}

export function RiskBadge({ level, score, verdict }: RiskBadgeProps) {
  return (
    <div className={cn(
      "apple-card p-3 flex flex-col md:flex-row items-start md:items-center gap-4 w-full transition-all duration-300 border",
      level === 'safe' && "border-l-[var(--accent)] border-l-[3px]",
      level === 'moderate' && "border-l-[var(--warning)] border-l-[3px]",
      level === 'high' && "border-l-[var(--danger)] border-l-[3px]"
    )}>
      <div className="flex flex-col items-center justify-center min-w-[80px]">
        <span className="text-2xl font-bold text-[var(--text-primary)] font-sans">{score}</span>
        <div className={cn(
          "px-2 py-0.5 rounded-full text-[9px] font-bold mt-2 uppercase tracking-tighter",
          level === 'safe' && "bg-[var(--accent)]/10 text-[var(--accent)]",
          level === 'moderate' && "bg-[var(--warning)]/10 text-[var(--warning)]",
          level === 'high' && "bg-[var(--danger)]/10 text-[var(--danger)]"
        )}>
          {level}
        </div>
      </div>
      <div className="flex-1 border-t md:border-t-0 md:border-l border-[var(--border)] pt-2 md:pt-0 md:pl-4">
        <h3 className="text-[9px] font-bold text-[var(--text-muted)] mb-1 font-sans uppercase tracking-tighter">Verdict</h3>
        <p className="text-[var(--text-primary)] font-sans text-xs leading-normal">{verdict}</p>
      </div>
    </div>
  );
}
