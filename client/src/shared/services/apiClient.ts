import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';
import { notifySessionExpired } from './sessionBridge';

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

const SESSION_EXCLUDED_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];
const RETRIED_HEADER = 'X-Sicura-Reintentado';
const SESSION_EXPIRED_MESSAGE = 'Tu sesión expiró';

let refreshInFlight: Promise<boolean> | null = null;

function isSessionExcludedPath(url: string | undefined): boolean {
  if (!url) return false;
  return SESSION_EXCLUDED_PATHS.some((path) => url.startsWith(path));
}

function wasRetried(config: InternalAxiosRequestConfig): boolean {
  return config.headers.get(RETRIED_HEADER) === '1';
}

function markRetried(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  config.headers.set(RETRIED_HEADER, '1');
  return config;
}

/**
 * Un solo refresh en vuelo: si cinco llamadas fallan a la vez esperan todas
 * la misma promesa en vez de renovar cinco veces, lo que el backend
 * interpretaria como robo al ver el refresh token ya rotado.
 */
function refreshOnce(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = apiClient
      .post('/auth/refresh')
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

/**
 * Renueva la sesion en silencio cuando el access token vencio y reintenta la
 * request original una sola vez. El refresh se niega solo: si se procesara como
 * renovable entraria en recursion.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError<ApiError>(error)) {
      return Promise.reject(error);
    }

    const config = error.config;
    if (!config || isSessionExcludedPath(config.url)) {
      return Promise.reject(error);
    }

    const response = error.response;
    if (!response || response.status !== 401 || response.data?.code !== 'TOKEN_EXPIRED') {
      return Promise.reject(error);
    }

    if (wasRetried(config)) {
      notifySessionExpired(SESSION_EXPIRED_MESSAGE);
      return Promise.reject(error);
    }

    return refreshOnce().then(
      (refreshed) => {
        if (!refreshed) {
          notifySessionExpired(SESSION_EXPIRED_MESSAGE);
          return Promise.reject(error);
        }
        return apiClient.request(markRetried(config));
      },
      () => {
        notifySessionExpired(SESSION_EXPIRED_MESSAGE);
        return Promise.reject(error);
      },
    );
  },
);

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
