export type ProductCategoria =
  | 'camaras'
  | 'cercos_perimetrales'
  | 'kits'
  | 'alarmas'
  | 'accesorios'
  | 'planes_adt';

/** Origen del producto: linea propia de SICURA o producto/plan ADT. */
export type ProductTipo = 'sicura' | 'adt';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: string;
  categoria: ProductCategoria;
  imagen_url: string | null;
  tipo: ProductTipo;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload del ABM de productos del panel administrativo. */
export interface ProductInput {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoria: ProductCategoria;
  imagen_url?: string | null;
  tipo: ProductTipo;
}
