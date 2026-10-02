import type { Product, ProductCategoria, ProductTipo, UserTipo } from '../../shared/types';

/** Filtros que expone el listado del catalogo. */
export interface CatalogFilters {
  categoria?: ProductCategoria;
  tipo?: ProductTipo;
}

/** El segmento elegido al entrar a la tienda condiciona que se muestra. */
export type Segmento = UserTipo;

export interface CatalogState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
