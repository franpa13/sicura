import { apiClient } from '../../shared/services';
import type { Order, Product, ProductInput, Quote } from '../../shared/types';

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

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/orders');
  return data;
}

export async function fetchQuotes(): Promise<Quote[]> {
  const { data } = await apiClient.get<Quote[]>('/quotes');
  return data;
}
