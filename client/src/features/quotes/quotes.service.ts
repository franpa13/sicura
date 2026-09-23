import { apiClient } from '../../shared/services';
import type { Quote, QuoteInput } from '../../shared/types';

export async function createQuote(input: QuoteInput): Promise<Quote> {
  const { data } = await apiClient.post<Quote>('/quotes', input);
  return data;
}

export async function fetchQuotes(): Promise<Quote[]> {
  const { data } = await apiClient.get<Quote[]>('/quotes');
  return data;
}
