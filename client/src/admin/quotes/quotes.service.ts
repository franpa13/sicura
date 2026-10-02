import { apiClient } from '../../shared/services';
import type { Quote } from '../../shared/types';

/** Seguimiento comercial de las cotizaciones que llegan desde la tienda. */
export async function fetchQuotes(): Promise<Quote[]> {
  const { data } = await apiClient.get<Quote[]>('/quotes');
  return data;
}
