import type { Product } from './product';

export type OrderEstado =
  | 'pendiente'
  | 'pagado'
  | 'en_preparacion'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export type MedioPago = 'mercado_pago' | 'transferencia' | 'tarjeta';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  cantidad: number;
  precio_unitario: string;
  product?: Product;
}

export interface Order {
  id: number;
  /** Nulo cuando la compra se hizo como invitado. */
  user_id: number | null;
  estado: OrderEstado;
  total: string;
  medio_pago: MedioPago;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

/** Linea del carrito antes de convertirse en OrderItem. */
export interface CheckoutItemInput {
  product_id: number;
  cantidad: number;
}

/** Datos de contacto de quien compra, sea invitado o usuario registrado. */
export interface CheckoutContacto {
  nombre: string;
  email: string;
  telefono: string;
}

export interface CheckoutInput {
  items: CheckoutItemInput[];
  medio_pago: MedioPago;
  contacto: CheckoutContacto;
  /** Nulo o ausente si la compra es como invitado. */
  user_id?: number | null;
}
