import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Logo } from '../components/shared/Logo';

export function Signup() {
  const { user, signIn } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-full flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-base)]">
      {/* Immersive Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover grayscale brightness-[0.4] contrast-150">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-business-charts-and-data-on-a-screen-21443-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-[var(--bg-base)]" />
      </div>

      <div className="w-full max-w-[340px] border border-[var(--border)] bg-[var(--bg-surface)]/90 p-6 relative rounded-2xl shadow-2xl z-10 backdrop-blur-2xl">
        <div className="mb-8 text-center flex flex-col items-center">
          <Logo className="w-12 h-12 text-[var(--accent)] mb-4" />
          <h1 className="text-xl font-black font-sans text-[var(--text-primary)] tracking-widest uppercase">Register</h1>
          <p className="text-[var(--text-muted)] mt-2 font-sans text-[10px] leading-tight max-w-[200px] uppercase font-bold tracking-widest">
            Join the protocol
          </p>
        </div>

        <button 
          onClick={signIn}
          className="w-full bg-[var(--text-primary)] text-[var(--bg-base)] py-3 rounded-xl font-sans font-black hover:opacity-90 transition-all flex items-center justify-center gap-3 mb-8 text-[11px] uppercase tracking-widest"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google Sync
        </button>

        <div className="text-center font-sans text-[10px] uppercase font-black tracking-widest">
          <p className="text-[var(--text-muted)] mb-2">Already registered?</p>
          <Link to="/login" className="text-[var(--accent)] hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
