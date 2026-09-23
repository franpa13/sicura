import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../shared/services';
import type { Product } from '../../shared/types';
import { fetchProducts } from '../catalog/catalog.service';
import { deleteProduct } from './admin.service';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await fetchProducts());
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  async function eliminar(id: number) {
    try {
      await deleteProduct(id);
      await recargar();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    }
  }

  return { products, loading, error, recargar, eliminar };
}
