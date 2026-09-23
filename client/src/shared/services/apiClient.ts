import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiError } from '../types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

/** Unico cliente HTTP de la app: todas las features llaman a la API por aca. */
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_STORAGE_KEY = 'sicura.token';

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Normaliza cualquier error de axios al mensaje que devuelve el backend. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrio un error inesperado';
}
