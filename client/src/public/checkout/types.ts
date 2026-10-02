import type { CheckoutContacto, MedioPago } from '../../shared/types';

/** Compra como invitado o asociada a un usuario registrado. */
export type ModoCompra = 'invitado' | 'registrado';

export interface CheckoutFormState {
  modo: ModoCompra;
  medio_pago: MedioPago;
  contacto: CheckoutContacto;
}
