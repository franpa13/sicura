/** Roles del panel administrativo y del cliente final. */
export type UserRol = 'admin' | 'cargador' | 'metricas' | 'cliente';

/** Segmento del visitante: define que catalogo y que flujo ve. */
export type UserTipo = 'persona' | 'empresa';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: UserRol;
  tipo: UserTipo;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}
