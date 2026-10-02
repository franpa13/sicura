import { apiClient } from '../../shared/services';
import type { Quote, QuoteInput } from '../../shared/types';

/** El cotizador publico solo crea solicitudes. El seguimiento vive en admin/quotes. */
export async function createQuote(input: QuoteInput): Promise<Quote> {
  const { data } = await apiClient.post<Quote>('/quotes', input);
  return data;
}
