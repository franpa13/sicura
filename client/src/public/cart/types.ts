import type { Product } from '../../shared/types';

/** Linea del carrito: se guarda el producto entero para poder mostrarlo sin volver a pedirlo. */
export interface CartLine {
  product: Product;
  cantidad: number;
}

export interface CartState {
  lines: CartLine[];
  total: number;
}
