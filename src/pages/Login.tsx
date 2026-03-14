import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Login() {
  const { user, signIn } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23888888' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '30px 30px'
      }} />
      <div className="w-full max-w-md border border-[var(--border)] bg-[var(--bg-surface)] p-10 relative rounded-3xl shadow-2xl z-10 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--success)] rounded-t-3xl" />
        
        <div className="mb-10 text-center">
          <p className="font-mono text-[var(--accent)] text-xs mb-3 uppercase tracking-widest">// AUTH.REQUIRED</p>
          <h1 className="text-4xl font-bold font-sans text-[var(--text-primary)] tracking-tight">Welcome Back</h1>
          <p className="text-[var(--text-muted)] mt-4 font-sans leading-relaxed text-lg">
            Authenticate to access your risk dashboard and portfolio analytics.
          </p>
        </div>

        <button 
          onClick={signIn}
          className="w-full bg-[var(--accent)] text-[var(--bg-base)] py-4 rounded-2xl font-sans font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 mb-10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
        >
          <ChevronRight className="w-6 h-6" /> Continue with Google
        </button>

        <div className="text-center font-sans text-base">
          <p className="text-[var(--text-muted)] mb-4">Don't have an account?</p>
          <Link 
            to="/signup"
            className="inline-block border border-[var(--border)] px-8 py-3 rounded-xl text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all font-bold shadow-sm hover:shadow-md"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-12 text-center font-mono text-xs text-[var(--text-muted)] opacity-50 flex justify-center gap-4">
          <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--success)] inline-block"></span> System Status: Online</p>
          <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--accent)] inline-block"></span> Encryption: Active</p>
        </div>
      </div>
    </div>
  );
}
