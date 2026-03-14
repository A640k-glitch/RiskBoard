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
      "apple-card p-14 flex flex-col md:flex-row items-start md:items-center gap-14 w-full transition-all duration-500 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)] border border-[var(--border)]/50 rounded-3xl",
      level === 'safe' && "border-l-[var(--accent)] border-l-2",
      level === 'moderate' && "border-l-[var(--warning)] border-l-2",
      level === 'high' && "border-l-[var(--danger)] border-l-2"
    )}>
      <div className="flex flex-col items-center justify-center min-w-[180px]">
        <span className="text-[60px] leading-none font-mono font-light text-[var(--text-primary)] tracking-widest">{score}</span>
        <div className={cn(
          "px-6 py-2.5 rounded-full text-[10px] font-medium uppercase tracking-[0.3em] mt-8 backdrop-blur-md shadow-sm border",
          level === 'safe' && "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20",
          level === 'moderate' && "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
          level === 'high' && "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20"
        )}>
          {level} Risk
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-[10px] font-medium text-[var(--text-muted)] mb-6 font-sans uppercase tracking-[0.3em] opacity-70">Risk Verdict</h3>
        <p className="text-[var(--text-primary)] font-sans leading-relaxed text-lg font-light tracking-wide">{verdict}</p>
      </div>
    </div>
  );
}
