import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextValue } from './AuthContext';

/** Estado de sesion compartido. Falla si se usa fuera del AuthProvider. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }

  return context;
}
