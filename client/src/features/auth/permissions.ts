import type { UserRol } from '../../shared/types';

export const ADMIN_ROLES: UserRol[] = ['admin', 'cargador', 'metricas'];

export function tieneAccesoAdmin(rol: UserRol): boolean {
  return ADMIN_ROLES.includes(rol);
}