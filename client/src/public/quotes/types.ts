import type { QuoteInput } from '../../shared/types';

/** El cotizador no genera una compra: deriva el pedido a contacto comercial. */
export type QuoteFormState = QuoteInput;

export interface QuoteSubmitResult {
  enviada: boolean;
  error: string | null;
}
