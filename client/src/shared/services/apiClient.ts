import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiError } from '../types';

// En desarrollo la API se sirve por el proxy de Vite, asi el navegador ve
// un solo origen. En produccion se apunta a VITE_API_URL.
const apiOrigin = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;
const baseURL = `${apiOrigin}/api`;

/** Unico cliente HTTP de la app: todas las features llaman a la API por aca. */
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
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
