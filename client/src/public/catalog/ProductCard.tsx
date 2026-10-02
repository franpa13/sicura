import { Link } from 'react-router-dom';
import { Card } from '../../shared/components';
import { formatPrecio } from '../../shared/utils';
import type { Product } from '../../shared/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      title={product.nombre}
      footer={<Link to={`/catalogo/${product.id}`}>Ver detalle</Link>}
    >
      {product.imagen_url ? <img src={product.imagen_url} alt={product.nombre} width={240} /> : null}
      <p>{product.descripcion}</p>
      <strong>{formatPrecio(product.precio)}</strong>
      <small> · {product.tipo === 'adt' ? 'ADT' : 'SICURA'}</small>
    </Card>
  );
}
