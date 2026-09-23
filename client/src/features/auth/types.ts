import type { UserTipo } from '../../shared/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

/** El registro es opcional: se puede comprar como invitado. */
export interface RegisterInput extends LoginCredentials {
  nombre: string;
  tipo: UserTipo;
}
