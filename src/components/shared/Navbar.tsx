import { useAuth } from '../../hooks/useAuth';
import { useCurrency } from '../../hooks/useCurrency';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { currency, setCurrency, rates } = useCurrency();
  const [isLightMode, setIsLightMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const navLinks = [
    { path: '/about', label: 'About' },
    ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : [{ path: '/login', label: 'Login' }]),
  ];

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[var(--text-primary)] hover:opacity-80 transition-opacity font-mono font-bold text-xl tracking-tight">
          <span className="text-[var(--accent)]">&gt;_</span> RiskBoard
        </Link>
        
        <div className="flex items-center gap-6 font-sans text-sm font-medium">
          <div className="relative">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)] appearance-none pr-8 cursor-pointer hover:border-[var(--text-muted)] transition-colors"
            >
              {Object.keys(rates).slice(0, 20).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-muted)]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2 rounded-full hover:bg-[var(--bg-surface)]"
            aria-label="Toggle theme"
          >
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path 
                    ? 'text-[var(--text-primary)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-[var(--bg-surface)] rounded-lg -z-10 border border-[var(--border)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          {user ? (
            <button 
              onClick={signOut}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-2 rounded-lg hover:bg-[var(--danger)]/10"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link 
              to="/signup"
              className="bg-[var(--accent)] text-[var(--bg-base)] px-5 py-2 font-bold hover:opacity-90 transition-opacity rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transform duration-200"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
