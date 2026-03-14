import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[var(--text-muted)] text-xs font-sans text-center sm:text-left">
          Copyright © {new Date().getFullYear()} RiskBoard Inc. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs font-sans text-[var(--text-muted)]">
          <Link to="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-[var(--text-primary)] transition-colors">Terms of Use</Link>
          <Link to="#" className="hover:text-[var(--text-primary)] transition-colors">Legal</Link>
          <Link to="#" className="hover:text-[var(--text-primary)] transition-colors">Site Map</Link>
        </div>
      </div>
    </footer>
  );
}
