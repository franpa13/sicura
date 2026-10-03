import { createContext } from 'react';
import type { User } from '../../shared/types';
import type { LoginCredentials, RegisterInput } from './types';

/**
 * Estado de la sesion. Son tres y no un booleano: mientras `verifying` no se
 * resuelve no se sabe si hay sesion, y usar `user !== null` para decidir
 * redirige al login durante un instante en cada recarga.
 */
export type AuthStatus = 'verifying' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  /** Hay un login o un registro en curso, para deshabilitar el boton del formulario. */
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
