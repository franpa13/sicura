import { Link } from 'react-router-dom';
import { PageHeader } from '../../shared/components';
import { formatPrecio } from '../../shared/utils';
import { CartLineRow } from './CartLineRow';
import { useCart } from './useCart';

export function CartPage() {
  const { lines, total, updateCantidad, removeProduct } = useCart();

  if (lines.length === 0) {
    return (
      <section>
        <PageHeader title="Carrito" />
        <p>
          Tu carrito esta vacio. <Link to="/catalogo">Ver catalogo</Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <PageHeader title="Carrito" />
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <CartLineRow
              key={line.product.id}
              line={line}
              onCantidadChange={updateCantidad}
              onRemove={removeProduct}
            />
          ))}
        </tbody>
      </table>

      <p>
        Total: <strong>{formatPrecio(total)}</strong>
      </p>
      <Link to="/checkout">Continuar la compra</Link>
    </section>
  );
}
