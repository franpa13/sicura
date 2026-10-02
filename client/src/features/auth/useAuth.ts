import { useState } from 'react';
import { getApiErrorMessage } from '../../shared/services';
import type { User } from '../../shared/types';
import { login as loginRequest, logout as logoutRequest, register as registerRequest } from './auth.service';
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
      setUser(await loginRequest(credentials));
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
    }
  }

  return { user, loading, error, login, register, logout };
}
