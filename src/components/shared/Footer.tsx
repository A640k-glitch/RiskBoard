import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-base)] py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] opacity-60">
        <div className="flex items-center gap-3">
          <Logo className="w-3 h-3 grayscale" />
          <span>RiskBoard Inc.</span>
        </div>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</Link>
          <Link to="#" className="hover:text-[var(--text-primary)] transition-colors">Legal</Link>
        </div>
      </div>
    </footer>
  );
}
