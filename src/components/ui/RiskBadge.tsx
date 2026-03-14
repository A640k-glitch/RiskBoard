import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RiskLevel } from '../../types';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function RiskBadge({ level, score, verdict }: { level: RiskLevel; score: number; verdict: string }) {
  return (
    <div className={cn(
      "apple-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full border",
      level === 'safe' && "border-l-[var(--accent)] border-l-[3px]",
      level === 'moderate' && "border-l-[var(--warning)] border-l-[3px]",
      level === 'high' && "border-l-[var(--danger)] border-l-[3px]"
    )}>
      <div className="flex sm:flex-col items-center gap-3 sm:gap-1 sm:min-w-[72px]">
        <span className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">{score}</span>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-tight",
          level === 'safe' && "bg-[var(--accent)]/10 text-[var(--accent)]",
          level === 'moderate' && "bg-[var(--warning)]/10 text-[var(--warning)]",
          level === 'high' && "bg-[var(--danger)]/10 text-[var(--danger)]"
        )}>
          {level}
        </div>
      </div>
      <div className="flex-1 border-t sm:border-t-0 sm:border-l border-[var(--border)] pt-3 sm:pt-0 sm:pl-4 w-full">
        <h3 className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] mb-1 uppercase tracking-widest">Verdict</h3>
        <p className="text-[var(--text-primary)] text-sm sm:text-base leading-relaxed">{verdict}</p>
      </div>
    </div>
  );
}
