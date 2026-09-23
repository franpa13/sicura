import { useState } from 'react';
import { getApiErrorMessage } from '../../shared/services';
import { createQuote } from './quotes.service';
import type { QuoteFormState } from './types';

const ESTADO_INICIAL: QuoteFormState = {
  nombre_empresa: '',
  contacto: '',
  detalle_servicio: '',
};

export function useQuoteForm() {
  const [form, setForm] = useState<QuoteFormState>(ESTADO_INICIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviada, setEnviada] = useState(false);

  function updateField<K extends keyof QuoteFormState>(campo: K, valor: QuoteFormState[K]) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      await createQuote(form);
      setEnviada(true);
      setForm(ESTADO_INICIAL);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { form, loading, error, enviada, updateField, submit };
}
