import { useState } from 'react';
import { getApiErrorMessage, setAuthToken } from '../../shared/services';
import type { User } from '../../shared/types';
import { login as loginRequest, register as registerRequest } from './auth.service';
import type { LoginCredentials, RegisterInput } from './types';

/**
 * Manejo de sesion. Cuando la feature crezca, esto pasa a un contexto
 * para compartir el usuario entre la tienda y el panel administrativo.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(credentials: LoginCredentials): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const session = await loginRequest(credentials);
      setAuthToken(session.token);
      setUser(session.user);
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
      const session = await registerRequest(input);
      setAuthToken(session.token);
      setUser(session.user);
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAuthToken(null);
    setUser(null);
  }

  return { user, loading, error, login, register, logout };
}
