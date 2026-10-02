import { apiClient } from '../../shared/services';
import type { Product } from '../../shared/types';
import type { CatalogFilters } from './types';

export async function fetchProducts(filters: CatalogFilters = {}): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products', { params: filters });
  return data;
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}
