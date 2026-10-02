import { apiClient } from '../shared/services';
import type { User } from '../shared/types';
import type { LoginCredentials, RegisterInput } from './types';

export async function login(credentials: LoginCredentials): Promise<User> {
  const { data } = await apiClient.post<User>('/auth/login', credentials);
  return data;
}

export async function register(input: RegisterInput): Promise<User> {
  const { data } = await apiClient.post<User>('/auth/register', input);
  return data;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

export async function refresh(): Promise<User> {
  const { data } = await apiClient.post<User>('/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
