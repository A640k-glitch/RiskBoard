import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Landing() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden perspective-1000">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23888888' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '30px 30px'
      }} />

      <section className="flex-1 flex flex-col justify-center px-4 py-20 relative z-10 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -100, rotateY: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1], // Apple-like spring ease
          }}
          className="max-w-3xl transform-style-3d"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono text-[var(--accent)] text-sm mb-6 uppercase tracking-widest"
          >
            // SYSTEM.INIT
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] tracking-tight mb-2 font-sans"
          >
            Don't let hidden risk
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-[var(--accent)] tracking-tight mb-8 font-mono"
          >
            &gt; destroy your<br/>portfolio.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-12 font-sans leading-relaxed"
          >
            RiskBoard is the definitive analytics shield for retail investors globally. 
            Navigate volatility, secure your assets, and trade with absolute peace of mind. 
            Protect your wealth. Secure your legacy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 font-sans"
          >
            <Link 
              to="/signup"
              className="w-full sm:w-auto bg-[var(--accent)] text-[var(--bg-base)] px-10 py-5 font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
            >
              <ChevronRight className="w-6 h-6" /> Secure Your Portfolio
            </Link>
            <Link 
              to="/about"
              className="w-full sm:w-auto border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] px-10 py-5 font-bold hover:bg-[var(--bg-elevated)] transition-all text-center rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 text-lg"
            >
              Read Docs
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
