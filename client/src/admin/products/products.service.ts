import { apiClient } from '../../shared/services';
import type { Product, ProductInput } from '../../shared/types';

/**
 * Acceso a productos desde el panel. Incluye las lecturas, que a futuro van a
 * divergir de las de la tienda: el panel necesita paginacion, filtro por estado
 * y orden por fecha de carga, cosas que el catalogo publico no usa.
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products');
  return data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', input);
  return data;
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/products/${id}`, input);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
