import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRol } from '../../shared/types';
import { useAuth } from './useAuth';

export function ProtectedRoute({ roles }: { roles: UserRol[] }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'verifying') {
    return <p role="status">Cargando...</p>;
  }

  if (status !== 'authenticated' || !user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  if (!roles.includes(user.rol)) {
    return <Navigate to="/catalogo" replace />;
  }

  return <Outlet />;
}