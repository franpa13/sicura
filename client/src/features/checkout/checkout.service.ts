import { apiClient } from '../../shared/services';
import type { CheckoutInput, Order } from '../../shared/types';

export async function createOrder(input: CheckoutInput): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders/checkout', input);
  return data;
}
