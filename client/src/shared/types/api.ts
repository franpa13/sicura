/** Forma del error que devuelve el backend desde su error middleware. */
export interface ApiError {
  message: string;
  details?: Record<string, unknown>;
}

/** Estado generico de una peticion, para tipar los hooks de cada feature. */
export interface RequestState {
  loading: boolean;
  error: string | null;
}
