import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, PageHeader } from '../../shared/components';
import { getApiErrorMessage } from '../../shared/services';
import { formatPrecio } from '../../shared/utils';
import type { Product } from '../../shared/types';
import { fetchProductById } from './catalog.service';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProductById(Number(id))
      .then(setProduct)
      .catch((err: unknown) => setError(getApiErrorMessage(err)));
  }, [id]);

  if (error) return <p role="alert">{error}</p>;
  if (!product) return <p>Cargando producto...</p>;

  return (
    <section>
      <PageHeader title={product.nombre} subtitle={formatPrecio(product.precio)} />
      {product.imagen_url ? <img src={product.imagen_url} alt={product.nombre} width={360} /> : null}
      <p>{product.descripcion}</p>
      <Button>Agregar al carrito</Button>
    </section>
  );
}
