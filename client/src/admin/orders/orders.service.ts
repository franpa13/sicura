import { apiClient } from '../../shared/services';
import type { Order } from '../../shared/types';

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/orders');
  return data;
}
