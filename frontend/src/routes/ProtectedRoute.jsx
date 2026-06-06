import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
    </div>
  );
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default ProtectedRoute;