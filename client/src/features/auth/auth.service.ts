import { apiClient } from '../../shared/services';
import type { AuthSession, User } from '../../shared/types';
import type { LoginCredentials, RegisterInput } from './types';

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>('/auth/login', credentials);
  return data;
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>('/auth/register', input);
  return data;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}
