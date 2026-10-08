import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getApiErrorMessage, onSessionExpired } from '../../shared/services';
import type { User } from '../../shared/types';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthStatus } from './AuthContext';
import { fetchProfile, login as loginRequest, logout as logoutRequest, register as registerRequest } from './auth.service';
import type { LoginCredentials, RegisterInput } from './types';

/**
 * Comparte el estado de sesion en toda la app. Al montar consulta
 * GET /auth/me: si responde hay sesion, si da 401 no la hay. No queda nada
 * guardado en el navegador, la cookie httpOnly la manda sola.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('verifying');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function bootstrap() {
      try {
        const perfil = await fetchProfile();
        if (cancelado) return;
        setUser(perfil);
        setStatus('authenticated');
      } catch {
        if (cancelado) return;
        setUser(null);
        setStatus('anonymous');
      }
    }

    void bootstrap();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(
    () =>
      onSessionExpired((message) => {
        setUser(null);
        setStatus('anonymous');
        setError(message);
      }),
    [],
  );

  async function login(credentials: LoginCredentials): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      setUser(await loginRequest(credentials));
      setStatus('authenticated');
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(input: RegisterInput): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      setUser(await registerRequest(input));
      setStatus('authenticated');
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setStatus('anonymous');
      setError(null);
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, loading, error, login, register, logout }),
    [user, status, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
