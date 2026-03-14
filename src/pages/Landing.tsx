import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../components/shared/Logo';

export function Landing() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full">
      {/* Hero Background Video */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover grayscale brightness-[0.6] contrast-125"
          poster="/hero.png"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-business-charts-and-data-on-a-screen-21443-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-base)] via-black/20 to-[var(--bg-base)]" />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <section className="flex-1 flex flex-col justify-center items-center px-4 relative z-10 max-w-6xl mx-auto w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <Logo className="w-20 h-20 text-[var(--accent)]" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-7xl md:text-8xl lg:text-[10rem] font-bold text-[var(--text-primary)] tracking-tighter mb-8 leading-[0.8] uppercase"
          >
            Secure <br/>
            Portfolio <br/>
            <span className="text-[var(--accent)]">Legacy.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-[var(--text-muted)] max-w-2xl mb-12 leading-relaxed font-bold uppercase tracking-[0.2em]"
          >
            Institutional intelligence for the modern investor. 
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-6"
          >
            <Link 
              to="/signup"
              className="bg-[var(--text-primary)] text-[var(--bg-base)] px-10 py-4 text-sm font-black rounded-full hover:opacity-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase tracking-widest"
            >
              Get Started
            </Link>
            <Link 
              to="/about"
              className="border-2 border-[var(--border)] bg-transparent text-[var(--text-primary)] px-10 py-4 text-sm font-black rounded-full hover:bg-[var(--bg-elevated)] transition-all uppercase tracking-widest backdrop-blur-sm"
            >
              Platform
            </Link>
          </motion.div>
        </motion.div>

        {/* Global Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--chart-1)]/5 blur-[150px] rounded-full pointer-events-none" />
      </section>
    </div>
  );
}
