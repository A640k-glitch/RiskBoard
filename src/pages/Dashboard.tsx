import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { RiskDashboard } from '../components/features/RiskDashboard';

export function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col overflow-y-auto no-scrollbar py-4">
      <RiskDashboard />
    </div>
  );
}
