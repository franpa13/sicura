import { useState } from 'react';
import { getApiErrorMessage } from '../../shared/services';
import type { CheckoutInput, Order } from '../../shared/types';
import { createOrder } from './checkout.service';

export function useCheckout() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(input: CheckoutInput): Promise<Order | null> {
    setLoading(true);
    setError(null);
    try {
      const creada = await createOrder(input);
      setOrder(creada);
      return creada;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { order, loading, error, submit };
}
