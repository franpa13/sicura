import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../shared/services';
import type { Product } from '../../shared/types';
import { fetchProducts } from './catalog.service';
import type { CatalogFilters, CatalogState } from './types';

export function useProducts(filters: CatalogFilters = {}): CatalogState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { categoria, tipo } = filters;

  useEffect(() => {
    let cancelado = false;

    setLoading(true);
    setError(null);

    fetchProducts({ categoria, tipo })
      .then((data) => {
        if (!cancelado) setProducts(data);
      })
      .catch((err: unknown) => {
        if (!cancelado) setError(getApiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [categoria, tipo]);

  return { products, loading, error };
}
