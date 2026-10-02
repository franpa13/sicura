import { Button, PageHeader } from '../../shared/components';
import { formatPrecio } from '../../shared/utils';
import { useAdminProducts } from './useAdminProducts';

export function AdminProductsPage() {
  const { products, loading, error, eliminar } = useAdminProducts();

  return (
    <section>
      <PageHeader title="Productos" subtitle="Alta, edicion y baja del catalogo" />

      {loading ? <p>Cargando...</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>{product.categoria}</td>
              <td>{product.tipo}</td>
              <td>{formatPrecio(product.precio)}</td>
              <td>
                <Button variant="ghost" onClick={() => void eliminar(product.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
